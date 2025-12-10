'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';

import { useOrderCalculator } from './items/useOrderCalculator';
import BulkHeader from './items/BulkHeader';
import ItemSelector from './items/ItemSelector';
import ItemConfigSheet from './items/ItemConfigSheet';
import CustomItemSheet from './items/CustomItemSheet'; 
import ManifestList from './items/ManifestList';

interface ItemsStepProps {
  form: UseFormReturn<CreateOrderInput>;
  dbItems: any[];
  settings: any;
  specialRates: any[];
  initialItems?: any[]; 
}

export default function ItemsStep({ form, dbItems, settings, specialRates, initialItems }: ItemsStepProps) {
  const [bulkWeight, setBulkWeight] = useState<number>(form.watch('bulk_weight') || 0);
  const [bulkService, setBulkService] = useState<'Wash & Fold' | 'Wash & Iron'>('Wash & Fold');
  
  const [manifest, setManifest] = useState<any[]>(() => {
    if (!initialItems) return [];
    
    const manualItems = initialItems.filter(i => !i.is_base_charge);
    
    return manualItems.map(i => ({
      item: { 
        id: i.item_id || 'manual', 
        name: i.item_name, 
        default_unit: i.weight > 0 ? 'KG' : 'PIECE', 
        kind: i.item_id ? 'STANDARD' : 'MANUAL' 
      },
      quantity: i.quantity,
      weight: i.weight,
      service_type: i.service_type,
      manual_rate: i.manual_rate // Preserve loaded manual rates
    }));
  });

  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [showCustomSheet, setShowCustomSheet] = useState(false); 

  useOrderCalculator({
    form,
    settings,
    manifest,
    bulkWeight,
    bulkService,
    specialRates
  });

  // Updated Handler with Override Price
  const handleAddItem = (data: { qty: number; weight: number; service: string; overridePrice?: number }) => {
    if (!activeItem) return;
    setManifest(prev => [...prev, {
      item: activeItem,
      quantity: data.qty,
      weight: data.weight,
      service_type: data.service,
      manual_rate: data.overridePrice // Pass to calculator
    }]);
    setActiveItem(null); 
  };

  const handleAddCustomItem = (customEntry: any) => {
    setManifest(prev => [...prev, customEntry]);
  };

  const handleRemoveItem = (index: number) => {
    setManifest(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      <BulkHeader 
        weight={bulkWeight} 
        setWeight={setBulkWeight} 
        service={bulkService} 
        setService={setBulkService} 
      />

      <ItemSelector 
        items={dbItems} 
        onSelect={setActiveItem}
        onCustomClick={() => setShowCustomSheet(true)} 
      />

      <ManifestList 
        manifest={manifest} 
        onRemove={handleRemoveItem} 
        bulkWeight={bulkWeight} 
      />

      {/* Standard Item Config */}
      {activeItem && (
        <ItemConfigSheet 
          item={activeItem}
          bulkService={bulkService}
          specialRates={specialRates} // <--- Pass Special Rates
          onClose={() => setActiveItem(null)}
          onConfirm={handleAddItem}
        />
      )}

      {/* Custom Item Config */}
      {showCustomSheet && (
        <CustomItemSheet 
          onClose={() => setShowCustomSheet(false)}
          onConfirm={handleAddCustomItem}
        />
      )}
    </div>
  );
}