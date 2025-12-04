import React from 'react';
import { Trash2, Check, Info } from 'lucide-react';

interface ManifestListProps {
  manifest: any[];
  onRemove: (idx: number) => void;
  bulkWeight: number;
}

export default function ManifestList({ manifest, onRemove, bulkWeight }: ManifestListProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manifest</h4>
          <span className="text-xs font-bold text-slate-400">{manifest.length} Items</span>
        </div>
        
        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {manifest.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              List is empty. Add items above.
            </div>
          ) : (
            manifest.map((entry, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {entry.item.default_unit === 'KG' ? 'Kg' : entry.quantity}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{entry.item.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      {entry.service_type === 'Standard' ? (
                        <>In Bulk Pile <Check size={10} /></>
                      ) : (
                        <span className={
                          entry.service_type === 'Iron Only' ? 'text-orange-500' : 'text-purple-500'
                        }>
                          {entry.service_type}
                        </span>
                      )}
                      {entry.item.default_unit === 'KG' && ` • ${entry.weight} kg`}
                    </p>
                  </div>
                </div>
                <button onClick={() => onRemove(idx)} className="text-slate-300 hover:text-red-500 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {bulkWeight === 0 && manifest.length > 0 && manifest.length <= 3 && (
         <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
            <Info size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-700">
              <strong>Small Order Mode:</strong> No bulk weight entered. Items charged per piece (₹15 standard).
            </p>
         </div>
      )}
    </div>
  );
}