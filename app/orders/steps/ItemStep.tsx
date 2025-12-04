'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';

// Import our new modules
import { useOrderCalculator } from './items/useOrderCalculator';
import BulkHeader from './items/BulkHeader';
import ItemSelector from './items/ItemSelector';
import ItemConfigSheet from './items/ItemConfigSheet';
import ManifestList from './items/ManifestList';

interface ItemsStepProps {
  form: UseFormReturn<CreateOrderInput>;
  dbItems: any[];
  settings: any;
}

export default function ItemsStep({ form, dbItems, settings }: ItemsStepProps) {
  // 1. State Management
  const [bulkWeight, setBulkWeight] = useState<number>(form.watch('bulk_weight') || 0);
  const [bulkService, setBulkService] = useState<'Wash & Fold' | 'Wash & Iron'>('Wash & Fold');
  const [manifest, setManifest] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  // 2. Logic Hook (Calculates prices and syncs to React Hook Form)
  useOrderCalculator({
    form,
    settings,
    manifest,
    bulkWeight,
    bulkService
  });

  // 3. Handlers
  const handleAddItem = (data: { qty: number; weight: number; service: string }) => {
    if (!activeItem) return;
    setManifest(prev => [...prev, {
      item: activeItem,
      quantity: data.qty,
      weight: data.weight,
      service_type: data.service
    }]);
    setActiveItem(null); // Close modal
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
        onCustomClick={() => {}}
      />

      <ManifestList 
        manifest={manifest} 
        onRemove={handleRemoveItem} 
        bulkWeight={bulkWeight} 
      />

      {/* Item Config Modal (Only shows when activeItem is set) */}
      {activeItem && (
        <ItemConfigSheet 
          item={activeItem}
          bulkService={bulkService}
          onClose={() => setActiveItem(null)}
          onConfirm={handleAddItem}
        />
      )}
    </div>
  );
}