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
  // (No changes here, same logic as before)
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

  // --- Date Formatting ---
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const createdDate = formatDate(order.created_at);
  const createdTime = formatTime(order.created_at);
  const dueDate = formatDate(order.due_date);
  const dueTime = formatTime(order.due_date);

  // Stamp Logic
  const isPaid = order.payment_status === 'PAID';
  const stampSrc = isPaid ? '/StampPaid.png' : '/StampUnpaid.png'; 
  const signerName = order.created_by_name || staffName || 'Staff';

  return (
    <div 
      ref={ref} 
      // MAIN CONTAINER CLASS FIXES:
      // 1. On Screen: w-full max-w-[80mm] mx-auto -> Centers it and prevents it from getting wider than a real receipt.
      // 2. On Print: print:w-[80mm] -> Forces exact thermal printer width.
      // 3. Removed min-h-[140mm] -> Keeps the receipt compact, only as tall as needed.
      className="bg-white text-slate-900 font-mono text-[10px] leading-tight w-full max-w-[80mm] mx-auto p-4 border shadow-sm relative flex flex-col print:w-[80mm] print:max-w-none print:shadow-none print:border-none print:p-4"
    >
      
      {/* ================= HEADER SECTION ================= */}
      <div className="text-center mb-3 pb-3 border-b border-dashed border-slate-300">
        <h1 className="text-lg font-bold uppercase tracking-wide text-slate-800">{branch.name}</h1>
        <p className="text-[9px] mt-1 px-4 leading-snug text-slate-500">{branch.address}</p>
        <p className="text-[9px] font-bold mt-1">Ph: {branch.phone || 'N/A'}</p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-3 pb-2 border-b border-slate-200">
        {/* Row 1: Bill & Date (Stacked) */}
        <div>
          <span className="text-[8px] text-slate-400 uppercase block">Bill No</span>
          <span className="font-bold text-slate-700 text-xs">{order.readable_bill_id || "PREVIEW"}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-slate-400 uppercase block">Created</span>
          <div className="leading-none">
            <span className="font-bold text-slate-700 block">{createdDate}</span>
            <span className="text-[8px] font-normal text-slate-500 block mt-0.5">{createdTime}</span>
          </div>
        </div>

        {/* Row 2: Customer & Mobile */}
        <div>
          <span className="text-[8px] text-slate-400 uppercase block">Customer</span>
          <span className="font-bold text-slate-800 line-clamp-1 text-[11px]">{order.customer_name}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-slate-400 uppercase block">Mobile</span>
          <span className="font-bold text-slate-700">{order.customer_phone}</span>
        </div>

        {/* Delivery Address (Full Width) */}
        {order.delivery_mode === 'DELIVERY' && (
           <div className="col-span-2 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[8px] text-slate-400 uppercase mr-1 font-bold">Del To:</span>
              <span className="font-medium text-slate-700 leading-snug">{order.customer_address || order.customers?.address || 'Address not provided'}</span>
           </div>
        )}
      </div>

      {/* ================= ITEMS SECTION ================= */}
      <div className="flex-1">
        <table className="w-full mb-2">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="py-1 w-[50%] font-bold">Item</th>
              <th className="py-1 text-center w-[15%] font-bold">Qty</th>
              <th className="py-1 text-center w-[15%] font-bold">Rate</th>
              <th className="py-1 text-right w-[20%] font-bold">Amt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dotted divide-slate-200">
            {/* 1. Bulk Pile */}
            {baseCharge && (
              <>
                <tr className="font-semibold text-slate-700">
                  <td className="py-2">
                    <span className="uppercase text-[9px]">{baseCharge.name}</span>
                  </td>
                  <td className="py-2 text-center">{baseCharge.weight}kg</td>
                  <td className="py-2 text-center">{Math.round(baseCharge.unit / (baseCharge.weight || 1))}</td>
                  <td className="py-2 text-right">{baseCharge.total}</td>
                </tr>
                {/* Pile Contents */}
                {pileItems.map((item: any, i: number) => (
                  <tr key={`pile-${i}`} className="text-slate-500 italic text-[9px]">
                    <td className="py-0.5 pl-2">• {item.name}</td>
                    <td className="py-0.5 text-center">{item.qty}</td>
                    <td className="py-0.5 text-center text-[8px]">-</td>
                    <td className="py-0.5 text-right">-</td>
                  </tr>
                ))}
              </>
            )}

            {/* Spacer */}
            {baseCharge && addOns.length > 0 && <tr><td colSpan={4} className="h-1"></td></tr>}

            {/* 2. Individual Items */}
            {addOns.map((item: any, i: number) => (
              <tr key={`addon-${i}`} className="text-slate-700">
                <td className="py-1.5">
                  <span className="font-medium">{item.name}</span>
                  {item.service_type !== 'Standard' && (
                    <span className="text-[7px] bg-slate-100 px-1 rounded ml-1 uppercase">
                      {item.service_type}
                    </span>
                  )}
                </td>
                <td className="py-1.5 text-center">{item.qty}</td>
                <td className="py-1.5 text-center">{item.unit}</td>
                <td className="py-1.5 text-right">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load Summary Box (SLIM VERSION) */}
        <div className="flex justify-between bg-slate-100 py-1.5 px-2 rounded-lg border border-slate-200 mb-2">
           <div className="flex flex-col items-center flex-1 border-r border-slate-300">
              <span className="text-[7px] text-slate-400 uppercase font-bold tracking-wider">Total Load</span>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">{stats.totalWeight > 0 ? stats.totalWeight.toFixed(2) : '0'} <span className="text-[8px]">kg</span></span>
           </div>
           <div className="flex flex-col items-center flex-1">
              <span className="text-[7px] text-slate-400 uppercase font-bold tracking-wider">Total Pcs</span>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">{stats.totalPieces}</span>
           </div>
        </div>
      </div>

      {/* ================= FOOTER SECTION ================= */}
      {/* Removed mt-auto here to keep the receipt compact in preview mode */}
      <div>
        
        {/* Main Footer Row */}
        <div className="flex justify-between items-end mb-4 pt-2 border-t border-slate-800 relative">
          
          {/* LEFT: Order Details Box */}
          <div className="flex-1 pr-4 self-end pb-1">
             <div className="grid grid-cols-[30px_auto] gap-y-2 text-[9px]">
                {/* Mode */}
                <span className="font-bold text-slate-400 text-[8px] uppercase tracking-wider self-center">Mode</span>
                <span className={`font-bold uppercase self-center ${order.delivery_mode === 'DELIVERY' ? 'text-blue-600' : 'text-slate-800'}`}>
                  {order.delivery_mode}
                </span>

                {/* Due Date */}
                <span className="font-bold text-slate-400 text-[8px] uppercase tracking-wider mt-0.5">Due</span>
                <div className="leading-none">
                   <span className="font-bold text-slate-800 block">{dueDate}</span>
                   <span className="text-[8px] text-slate-500 block">{dueTime}</span>
                </div>
             </div>
          </div>

          {/* RIGHT: Financials & Stamp */}
          <div className="text-right space-y-1 min-w-[110px] relative z-10 pl-2">
            
            {/* STAMP (Hidden in Preview) */}
            {!isPreview && (
                <div className="absolute -top-5 right-[50px] pointer-events-none z-0">
                <img 
                    src={stampSrc} 
                    alt="Status" 
                    className="w-24 opacity-30 mix-blend-multiply -rotate-12 grayscale-[0.2]"
                />
                </div>
            )}

            <div className="flex justify-between text-slate-500 text-[9px]">
              <span>Subtotal</span>
              <span>₹{order.total_amount}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-slate-500 text-[9px]">
                <span>Discount</span>
                <span>- ₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-dotted border-slate-300 pt-1 mt-1">
              <span>Total</span>
              <span>₹{order.final_amount}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: QR & Generated By */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-300">
           
           {/* QR Code (Hidden in Preview) */}
           <div>
             {!isPreview && order.readable_bill_id && (
               <div className="bg-white">
                  <QRCode 
                    value={JSON.stringify({ id: order.id })} 
                    size={48} 
                  />
               </div>
             )}
           </div>

           {/* Info Text */}
           <div className="text-right flex flex-col justify-end h-12">
              <p className="text-[8px] text-slate-400">
                Generated by: <span className="font-medium text-slate-600 uppercase">{signerName}</span>
              </p>
              <p className="text-[8px] text-slate-400 italic mt-0.5">
                Thank you for choosing Nath!
              </p>
           </div>
        </div>

        {/* T&C Link */}
        <div className="text-center mt-3 pt-1 border-t border-dotted border-slate-200">
           <p className="text-[7px] text-slate-400">
             For terms & conditions, visit: <span className="text-slate-500 font-medium">nath-laundry.vercel.app/terms&conditions</span>
           </p>
        </div>

      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";
export default Receipt;