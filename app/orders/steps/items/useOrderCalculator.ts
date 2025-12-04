import { useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface CalculatorProps {
  form: UseFormReturn<CreateOrderInput>;
  settings: any;
  manifest: any[];
  bulkWeight: number;
  bulkService: 'Wash & Fold' | 'Wash & Iron';
  specialRates?: any[];
}

export function useOrderCalculator({ 
  form, 
  settings, 
  manifest, 
  bulkWeight, 
  bulkService, 
  specialRates = [] 
}: CalculatorProps) {
  const { control, setValue } = form;
  const { replace } = useFieldArray({ control, name: 'items' });

  // Constants derived from settings
  const RATES = {
    wf_kg: Number(settings.wf_kg_rate || 45),
    wi_kg: Number(settings.wi_kg_rate || 60),
    iron_piece: Number(settings.iron_only_piece_rate || 8),
    small_piece: Number(settings.small_order_piece_rate || 15),
    blanket_flat: Number(settings.blanket_flat_rate || 100),
    blanket_kg: Number(settings.blanket_kg_rate || 80),
    blanket_threshold: Number(settings.blanket_flat_threshold_kg || 1.5),
  };

  useEffect(() => {
    const finalBillItems: any[] = [];

    // 1. Bulk Base Charge
    if (bulkWeight > 0) {
      const rate = bulkService === 'Wash & Iron' ? RATES.wi_kg : RATES.wf_kg;
      const basePrice = Math.round(bulkWeight * rate);
      
      finalBillItems.push({
        item_name: `Bulk Pile (${bulkService})`,
        service_type: bulkService,
        quantity: 1,
        weight: bulkWeight,
        unit_price: basePrice,
        total_price: basePrice,
        is_base_charge: true,
      });
    }

    // 2. Process Manifest
    manifest.forEach(entry => {
      let price = 0;
      let serviceLabel = entry.service_type;

      // Logic A: Small Order Mode (No Weight entered)
      if (bulkWeight === 0 && entry.item.default_unit === 'PIECE') {
         price = RATES.small_piece;
         serviceLabel = 'Wash & Fold'; // Default small order service
         
         // Override if Iron Only selected
         if (entry.service_type === 'Iron Only') {
            price = RATES.iron_piece;
            serviceLabel = 'Iron Only';
         }
      } 
      // Logic B: Bulk Mode (Weight entered)
      else {
        if (entry.service_type === 'Standard') {
           // Free (covered by bulk weight)
           price = 0;
           serviceLabel = bulkService; 
        } else if (entry.service_type === 'Iron Only') {
           // Add-on Charge
           price = RATES.iron_piece;
        } else if (entry.service_type === 'Dry Clean') {
           // Separate Bill
           const spRate = specialRates.find(r => r.item_id === entry.item.id && r.service_type === 'Dry Clean');
           price = spRate ? spRate.rate_value : 200; // Fallback
        }
      }

      // Logic C: Special KG Items (Blankets/Curtains)
      if (entry.item.default_unit === 'KG') {
         const w = entry.weight || 0;
         if (w <= RATES.blanket_threshold) {
            price = RATES.blanket_flat;
         } else {
            price = Math.round(w * RATES.blanket_kg);
         }
         serviceLabel = 'Special Wash';
      }

      finalBillItems.push({
        item_id: entry.item.id,
        item_name: entry.item.name,
        service_type: serviceLabel,
        quantity: entry.quantity,
        weight: entry.weight,
        unit_price: price,
        total_price: price * (entry.item.default_unit === 'KG' ? 1 : entry.quantity)
      });
    });

    // 3. Sync to Form
    replace(finalBillItems);
    setValue('bulk_weight', bulkWeight);

  }, [bulkWeight, bulkService, manifest, settings, replace, setValue]);
}