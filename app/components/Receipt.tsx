// File: app/components/Receipt.tsx
import React, { forwardRef, useMemo } from 'react';
import QRCode from "react-qr-code";

interface ReceiptProps {
  order: any;
  branch: any;
  isPreview?: boolean;
  staffName?: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ order, branch, isPreview = false, staffName }, ref) => {
  if (!order || !branch) return null;

  // --- 1. Data Prep ---
  const { pileItems, addOns, baseCharge, stats } = useMemo(() => {
    const items = order.order_items || order.items || [];
    
    const normalizedItems = items.map((i: any) => ({
      ...i,
      name: i.item_name_snapshot || i.item_name,
      total: Number(i.total_price || 0),
      unit: Number(i.unit_price || 0),
      weight: Number(i.weight || i.weight_kg || 0),
      qty: Number(i.quantity || 0)
    }));

    const baseCharge = normalizedItems.find((i: any) => i.name.startsWith('Bulk Pile'));
    
    const pileItems = normalizedItems.filter((i: any) => 
      !i.name.startsWith('Bulk Pile') && 
      (i.service_type === 'Wash & Fold' || i.service_type === 'Wash & Iron') &&
      i.total === 0
    );

    const addOns = normalizedItems.filter((i: any) => 
      !i.name.startsWith('Bulk Pile') && 
      !pileItems.includes(i)
    );

    const totalWeight = normalizedItems.reduce((sum: number, i: any) => sum + i.weight, 0);
    const totalPieces = order.total_piece_count || order.total_item_count || normalizedItems.reduce((sum: number, i: any) => sum + i.qty, 0);

    return { pileItems, addOns, baseCharge, stats: { totalWeight, totalPieces } };
  }, [order]);

  const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  const timeStr = order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'}) : '';
  const displayAddress = order.customer_address || (order.customers?.address) || '';
  const showAddress = order.delivery_mode === 'DELIVERY';

  // --- 2. Stamp Logic ---
  const isPaid = order.payment_status === 'PAID';
  const stampSrc = isPaid ? '/StampPaid.png' : '/StampUnpaid.png'; 

  // --- 3. Signature Logic ---
  // Use creator name if available (saved in DB), else fallback to current staff (preview mode)
  const signerName = order.created_by_name || staffName || 'Staff';

  return (
    <div ref={ref} className="p-6 bg-white text-black font-mono text-xs leading-tight max-w-[80mm] mx-auto print:max-w-none print:w-full border shadow-sm print:shadow-none print:border-none my-4 relative overflow-hidden">
      
      {/* --- WATERMARK STAMP --- */}
      {!isPreview && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none rotate-[-15deg] z-0 mix-blend-multiply">
           {/* Using standard img for better print compatibility in some browsers */}
           <img 
             src={stampSrc} 
             alt={isPaid ? "PAID" : "UNPAID"} 
             width={180} 
             style={{ maxWidth: 'none' }} 
           />
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4 border-b-2 border-black pb-3 relative z-10">
        <h1 className="text-xl font-bold uppercase tracking-wider">{branch.name}</h1>
        <p className="text-[10px] mt-1 whitespace-pre-wrap">{branch.address}</p>
        <p className="text-[10px] mt-1 font-bold">Ph: {branch.phone || 'N/A'}</p>
      </div>

      {/* Meta */}
      <div className="mb-3 text-[10px] relative z-10">
        <div className="flex justify-between font-bold text-sm mb-1">
          <span>Bill #: {order.readable_bill_id || (isPreview ? "PREVIEW" : "---")}</span>
        </div>
        <div className="flex justify-between">
          <span>Date: {dateStr} {timeStr}</span>
        </div>
        <div className="flex justify-between mt-1 pt-1 border-t border-dotted border-gray-400">
          <span className="uppercase font-bold">Mode: {order.delivery_mode}</span>
        </div>
        {showAddress && (
           <div className="mt-1 text-[9px] border-l-2 border-black pl-2 py-1 bg-gray-50">
             <span className="font-bold">Del To:</span> {displayAddress}
           </div>
        )}
      </div>

      {/* Customer */}
      <div className="mb-4 border-b-2 border-black pb-2 relative z-10">
        <p className="text-xs font-bold uppercase">Customer: {order.customer_name}</p>
        <p className="text-[10px]">Ph: {order.customer_phone}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 text-[10px] relative z-10">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="py-1 w-[50%]">Item & Service</th>
            <th className="py-1 text-center w-[15%]">Qty</th>
            <th className="py-1 text-center w-[15%]">Rate</th>
            <th className="py-1 text-right w-[20%]">Amt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dotted divide-gray-300">
          {baseCharge && (
            <>
              <tr className="font-bold bg-gray-50">
                <td className="py-2">
                  <span className="uppercase">{baseCharge.name}</span>
                  <div className="text-[9px] font-normal italic">Weight Charge</div>
                </td>
                <td className="py-2 text-center">{baseCharge.weight}kg</td>
                <td className="py-2 text-center">{baseCharge.weight > 0 ? Math.round(baseCharge.unit / baseCharge.weight) : 0}/kg</td>
                <td className="py-2 text-right">{baseCharge.total}</td>
              </tr>
              {pileItems.length > 0 && (
                 <tr>
                   <td colSpan={4} className="py-1 pl-2 text-[9px] text-gray-500 italic bg-gray-50/50">
                     Pile Contents (Included):
                   </td>
                 </tr>
              )}
              {pileItems.map((item: any, i: number) => (
                <tr key={`pile-${i}`} className="text-gray-600">
                  <td className="py-1 pl-4">{item.name}</td>
                  <td className="py-1 text-center">{item.qty}</td>
                  <td className="py-1 text-center">-</td>
                  <td className="py-1 text-right">-</td>
                </tr>
              ))}
            </>
          )}

          {baseCharge && addOns.length > 0 && <tr><td colSpan={4} className="h-2"></td></tr>}

          {addOns.map((item: any, i: number) => (
            <tr key={`addon-${i}`}>
              <td className="py-2">
                <span className="font-semibold">{item.name}</span>
                <div className="text-[9px] uppercase font-bold tracking-tighter text-slate-600">
                  [{item.service_type === 'Custom' ? 'CUSTOM' : item.service_type}]
                </div>
              </td>
              <td className="py-2 text-center align-top pt-2">{item.qty}</td>
              <td className="py-2 text-center align-top pt-2">{item.unit}</td>
              <td className="py-2 text-right align-top pt-2">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stats */}
      <div className="flex justify-between bg-gray-100 p-2 rounded-md mb-3 text-[10px] font-bold border border-gray-200 relative z-10">
        <span>Total Weight: {stats.totalWeight > 0 ? `${stats.totalWeight.toFixed(2)} kg` : '0 kg'}</span>
        <span>Total Pieces: {stats.totalPieces}</span>
      </div>

      {/* Financials */}
      <div className="border-t-2 border-black pt-2 space-y-1 text-right mb-6 relative z-10">
        <div className="flex justify-between text-[10px]">
          <span>Subtotal:</span><span>₹{order.total_amount}</span>
        </div>
        {order.discount_amount > 0 && (
          <div className="flex justify-between text-[10px]">
            <span>Discount:</span><span>- ₹{order.discount_amount}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold mt-2 border-t border-dotted border-gray-400 pt-2">
          <span>Total:</span><span>₹{order.final_amount}</span>
        </div>
        <div className="text-[10px] uppercase font-bold pt-1">
           Payment: {order.payment_status}
        </div>
      </div>

      {/* --- SIGNATURE BLOCK --- */}
      <div className="relative z-10 pt-4 mt-4 border-t border-dashed border-black break-inside-avoid">
        <div className="flex justify-between items-end mb-6 text-[9px]">
           <div className="text-left">
              <p className="font-bold text-gray-500 mb-1">Generated By:</p>
              <p className="font-bold text-sm text-black uppercase tracking-wide border-b border-gray-300 pb-0.5 inline-block min-w-80px">
                {signerName}
              </p>
           </div>
           <div className="text-right">
              <div className="h-8 mb-1"></div>
              <p className="font-bold border-t border-black pt-1 inline-block min-w-[100px] text-center">Authorized Signatory</p>
           </div>
        </div>

        {!isPreview && order.readable_bill_id && (
          <div className="flex justify-center mb-3">
             <QRCode 
               value={JSON.stringify({ id: order.id, bill: order.readable_bill_id })} 
               size={80} 
             />
          </div>
        )}
        <p className="text-[10px] font-bold uppercase text-center">
          {isPreview ? "*** PREVIEW COPY ***" : "Scan to Track Status"}
        </p>
        <p className="text-[9px] mt-1 font-medium text-center">We handle the dirty work!</p>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";
export default Receipt;