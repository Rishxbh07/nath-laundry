import { useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface CalculatorProps {
  form: UseFormReturn<CreateOrderInput>;
  settings: any;
  manifest: any[];
  bulkWeight: number;
  bulkService: 'Wash & Fold' | 'Wash & Iron';
  specialRates: any[];
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

  const RATES = {
    wf_kg: Number(settings?.wf_kg_rate || 45),
    wi_kg: Number(settings?.wi_kg_rate || 60),
    iron_piece: Number(settings?.iron_only_piece_rate || 8),
    small_piece: Number(settings?.small_order_piece_rate || 15),
    blanket_flat: Number(settings?.blanket_flat_rate || 100),
    blanket_kg: Number(settings?.blanket_kg_rate || 80),
    blanket_threshold: Number(settings?.blanket_flat_threshold_kg || 1.5),
    dry_clean_default: 50,
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
      
      const isManual = entry.item.kind === 'MANUAL';
      
      const getSpecialRate = (sType: string) => {
        return specialRates.find(
          r => r.item_id === entry.item.id && r.service_type === sType
        )?.rate_value;
      };

      // --- PRIORITY 1: MANUAL OVERRIDE (New Logic) ---
      // If a manual rate is provided (via override or custom item), use it directly.
      if (entry.manual_rate !== undefined && entry.manual_rate !== null) {
         price = Number(entry.manual_rate);
         // Keep existing service label unless it's generic
         if (!serviceLabel || serviceLabel === 'Standard') {
            serviceLabel = 'Special Wash';
         }
      }
      
      // --- Logic A: Standard Service ---
      else if (entry.service_type === 'Standard') {
        const explicitRate = getSpecialRate('Standard') || getSpecialRate('Wash');

        if (explicitRate !== undefined) {
           price = Number(explicitRate);
           serviceLabel = 'Special Wash'; 
        } 
        else if (entry.item.kind === 'SPECIAL') {
          price = 50; 
          serviceLabel = 'Special Wash';
        } 
        else if (bulkWeight === 0 && entry.item.default_unit === 'PIECE') {
          price = RATES.small_piece;
          serviceLabel = 'Piece Wash';
        } 
        else {
          price = 0; 
          serviceLabel = bulkService; 
        }
      }

      // --- Logic B: Iron Only ---
      else if (entry.service_type === 'Iron Only') {
        const customRate = getSpecialRate('Iron Only');
        price = Number(customRate || RATES.iron_piece);
      } 

      // --- Logic C: Dry Clean ---
      else if (entry.service_type === 'Dry Clean') {
         const customRate = getSpecialRate('Dry Clean');
         price = Number(customRate || RATES.dry_clean_default);
      }

      // --- Logic D: Weight Based Specials ---
      // Applies only if NO manual override and NO special fixed price set
      if (!isManual && entry.manual_rate === undefined && entry.item.default_unit === 'KG') {
         if (price === 0 || price === 50) { 
            const w = entry.weight || 0;
            if (w <= RATES.blanket_threshold) {
                price = RATES.blanket_flat;
            } else {
                price = Math.round(w * RATES.blanket_kg);
            }
            serviceLabel = 'Heavy Wash';
         }
      }

      // 3. Push Calculated Item
      finalBillItems.push({
        item_id: isManual ? null : entry.item.id,
        item_name: entry.item.name,
        service_type: serviceLabel,
        quantity: entry.quantity,
        weight: entry.weight,
        unit_price: price,
        total_price: (entry.item.default_unit === 'KG' && !isManual) 
          ? price 
          : price * entry.quantity,
        is_chargeable: !entry.is_base_charge,
        manual_rate: entry.manual_rate // Persist the override
      });
    });

    replace(finalBillItems);
    setValue('bulk_weight', bulkWeight);

  }, [bulkWeight, bulkService, manifest, settings, replace, setValue, specialRates]);
}