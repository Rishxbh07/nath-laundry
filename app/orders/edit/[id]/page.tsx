import React from 'react';
import { fetchLaundryMeta, fetchOrderDetails } from '@/app/actions/order';
import OrderWizard from '@/app/orders/OrderWizard';
import { redirect } from 'next/navigation';

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch both Meta (for menu items) and the specific Order
  const [meta, orderData] = await Promise.all([
    fetchLaundryMeta(),
    fetchOrderDetails(id)
  ]);

  if (!orderData) {
    return <div>Order not found</div>;
  }

  // Transform DB Order to Form Shape
  const initialOrder = {
    id: orderData.id,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    customer_address: orderData.customer_address,
    delivery_mode: orderData.delivery_mode,
    // Extract Date and Time from ISO string
    due_date: new Date(orderData.due_date).toISOString().split('T')[0],
    due_time: new Date(orderData.due_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    discount_amount: orderData.discount_amount,
    payment_status: orderData.payment_status,
    payment_method: orderData.payment_method,
    total_item_count: orderData.total_piece_count,
    items: orderData.order_items.map((i: any) => ({
      item_id: i.item_id,
      item_name: i.item_name_snapshot,
      service_type: i.service_type,
      quantity: i.quantity,
      weight: i.weight_kg,
      unit_price: i.unit_price,
      total_price: i.total_price,
      is_base_charge: i.total_price > 0 && i.item_name_snapshot.includes('Bulk Pile') // Infer base charge
    }))
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col h-screen">
        <OrderWizard 
          branchId={meta.branch_id} 
          items={meta.items}
          settings={meta.settings}
          specialRates={meta.specialRates}
          branchData={meta.branch} 
          staffName={meta.user_name}
          initialOrder={initialOrder} // <--- Pass existing data
          isEditing={true}            // <--- Flag for Edit Mode
        />
      </div>
    </main>
  );
}