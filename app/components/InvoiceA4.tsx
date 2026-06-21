import React, { forwardRef, useMemo } from 'react';
import QRCode from "react-qr-code";

interface InvoiceProps {
  order: any;
  branch: any;
  staffName?: string;
}

export const InvoiceA4 = forwardRef<HTMLDivElement, InvoiceProps>(({ order, branch, staffName }, ref) => {
  if (!order || !branch) return null;

  // --- 1. Data Prep (Same logic, reused) ---
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

  // --- Dates ---
  const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const formatTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  const isPaid = order.payment_status === 'PAID';
  const stampSrc = isPaid ? '/StampPaid.png' : '/StampUnpaid.png'; 

  return (
    <div 
      ref={ref} 
      className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-10 mx-auto relative flex flex-col print:w-full print:h-auto print:min-h-0"
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-900">{branch.name}</h1>
          <div className="mt-2 text-sm text-slate-600 max-w-[300px] leading-relaxed">
            {branch.address}
          </div>
          <p className="mt-2 text-sm font-semibold">Phone: {branch.phone}</p>
        </div>
        
        <div className="text-right">
          <h2 className="text-5xl font-black text-slate-100 uppercase tracking-widest mb-4">INVOICE</h2>
          <div className="space-y-1">
            <p className="text-sm"><span className="font-bold text-slate-500 uppercase text-xs mr-3">Bill No</span> <span className="font-mono font-bold text-slate-800">{order.readable_bill_id}</span></p>
            <p className="text-sm"><span className="font-bold text-slate-500 uppercase text-xs mr-3">Date</span> {formatDate(order.created_at)}</p>
            <p className="text-sm"><span className="font-bold text-slate-500 uppercase text-xs mr-3">Due</span> {formatDate(order.due_date)}</p>
          </div>
        </div>
      </div>

      {/* --- CUSTOMER --- */}
      <div className="flex justify-between mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Billed To</span>
          <h3 className="text-xl font-bold text-slate-800">{order.customer_name}</h3>
          <p className="text-sm text-slate-600 mt-1 font-mono">{order.customer_phone}</p>
          {order.delivery_mode === 'DELIVERY' && (
             <div className="mt-3 text-sm text-slate-600 max-w-sm">
                <span className="font-bold text-slate-800 text-xs uppercase mr-1">Delivering To:</span> 
                {order.customer_address || 'Address not provided'}
             </div>
          )}
        </div>
        <div className="text-right">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Order Details</span>
           <div className="flex flex-col items-end gap-1">
              <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase ${order.delivery_mode === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {order.delivery_mode}
              </span>
              <span className="text-sm text-slate-500 mt-1">
                Status: <span className="font-bold text-slate-800">{isPaid ? 'Paid' : 'Unpaid'}</span>
              </span>
           </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="flex-1">
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="text-left py-3 font-bold text-sm uppercase text-slate-600 pl-2">Item Description</th>
              <th className="text-center py-3 font-bold text-sm uppercase text-slate-600 w-32">Service</th>
              <th className="text-center py-3 font-bold text-sm uppercase text-slate-600 w-24">Qty/Wt</th>
              <th className="text-center py-3 font-bold text-sm uppercase text-slate-600 w-24">Rate</th>
              <th className="text-right py-3 font-bold text-sm uppercase text-slate-600 w-32 pr-2">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {/* Base Charge */}
            {baseCharge && (
              <>
                <tr className="font-semibold bg-slate-50/50">
                  <td className="py-3 pl-2">{baseCharge.name}</td>
                  <td className="py-3 text-center text-xs uppercase text-slate-500">{baseCharge.service_type}</td>
                  <td className="py-3 text-center">{baseCharge.weight} kg</td>
                  <td className="py-3 text-center">{Math.round(baseCharge.unit / (baseCharge.weight || 1))} /kg</td>
                  <td className="py-3 text-right pr-2">{baseCharge.total}</td>
                </tr>
                {/* Detailed List */}
                {pileItems.map((item: any, i: number) => (
                  <tr key={`pile-${i}`} className="text-slate-500 text-xs">
                    <td className="py-2 pl-6 italic flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {item.name}
                    </td>
                    <td className="py-2 text-center">-</td>
                    <td className="py-2 text-center">{item.qty}</td>
                    <td className="py-2 text-center">-</td>
                    <td className="py-2 text-right pr-2">-</td>
                  </tr>
                ))}
              </>
            )}

            {/* Add Ons */}
            {addOns.map((item: any, i: number) => (
              <tr key={`addon-${i}`}>
                <td className="py-3 pl-2 font-medium">{item.name}</td>
                <td className="py-3 text-center text-xs uppercase text-slate-500 bg-slate-50 rounded mx-2">{item.service_type}</td>
                <td className="py-3 text-center">{item.qty}</td>
                <td className="py-3 text-center">{item.unit}</td>
                <td className="py-3 text-right pr-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER --- */}
      <div className="break-inside-avoid mt-8">
        <div className="flex justify-end border-t border-slate-200 pt-6 relative">
          
          {/* Stamp Placement (Safe Zone) */}
          <div className="absolute -top-5 right-[280px] pointer-events-none">
             <img src={stampSrc} alt="Status" className="w-40 opacity-20 -rotate-12 mix-blend-multiply" />
          </div>

          <div className="w-1/3 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>₹{order.total_amount}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>- ₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold text-slate-900 border-t-2 border-slate-800 pt-4 mt-2">
              <span>Total</span>
              <span>₹{order.final_amount}</span>
            </div>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="mt-16 flex items-end justify-between border-t border-dashed border-slate-300 pt-6">
           <div className="flex items-center gap-4">
              <QRCode value={`https://nath-laundry.vercel.app/bill/${order.id}`} size={64} />
              <div className="text-xs text-slate-400">
                 <p className="uppercase font-bold text-slate-600 mb-1">Scan to Verify</p>
                 <p>Generated by: {staffName || 'System'}</p>
                 <p className="mt-0.5">Time: {formatTime(new Date().toISOString())}</p>
              </div>
           </div>
           
           <div className="text-right text-xs text-slate-400">
              <p className="mb-1">Thank you for your business!</p>
              <p>Terms & Conditions: Laundry-man.vercel.app/terms</p>
           </div>
        </div>
      </div>
    </div>
  );
});

InvoiceA4.displayName = "InvoiceA4";
export default InvoiceA4;