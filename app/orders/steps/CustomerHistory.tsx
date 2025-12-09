// File: app/orders/steps/CustomerHistory.tsx
import React from 'react';
import { Clock, Weight, Shirt, IndianRupee } from 'lucide-react';

interface HistoryOrder {
  id: string;
  billId: string;
  date: string;
  amount: number;
  pcs: number;
  weight: number;
}

export default function CustomerHistory({ history }: { history: HistoryOrder[] }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
        <Clock size={12} /> Recent Orders
      </h4>
      
      <div className="grid gap-2">
        {history.map((order) => (
          <div key={order.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
            
            {/* Left: Date & Bill ID */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs font-bold text-slate-800">#{order.billId || '---'}</p>
            </div>

            {/* Middle: Load Info */}
            <div className="flex items-center gap-3">
              {order.weight > 0 && (
                <div className="flex items-center gap-1 text-slate-600">
                  <Weight size={12} />
                  <span className="text-xs font-bold">{order.weight}kg</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-slate-600">
                <Shirt size={12} />
                <span className="text-xs font-bold">{order.pcs}pc</span>
              </div>
            </div>

            {/* Right: Amount */}
            <div className="flex items-center text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
              <IndianRupee size={10} />
              <span className="text-sm font-bold">{order.amount}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}