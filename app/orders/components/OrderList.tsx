'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, ChevronUp, Save, FileText, 
  CheckCircle2, AlertCircle, Clock, X, Filter, Calendar, Archive, CalendarDays,
  Package, CheckCircle, CheckCheck // Added CheckCheck for Delivered icon
} from 'lucide-react';
import { fetchAllOrders, saveOrderNote } from '@/app/actions/order-list';
import { markOrderAsPacked } from '@/app/actions/order';
import { useRouter } from 'next/navigation';

// Debounce Helper
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function OrderList({ branchId }: { branchId: string }) {
  const router = useRouter();
  
  // -- State --
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [showClosed, setShowClosed] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PACKED' | 'UNPACKED'>('ALL');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // -- Fetch Data --
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllOrders(branchId, debouncedSearch, dateFilter, showClosed);
      setOrders(data);
      setLoading(false);
    }
    load();
  }, [branchId, debouncedSearch, dateFilter, showClosed]);

  // -- Actions --
  const handleSaveNote = async (orderId: string) => {
    await saveOrderNote(orderId, noteText);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes: noteText } : o));
    setEditingNoteId(null);
  };

  const startEditNote = (order: any) => {
    setNoteText(order.notes || '');
    setEditingNoteId(order.id);
  };

  const handleMarkAsPacked = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setLoadingId(orderId);
    try {
      await markOrderAsPacked(orderId);
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'READY' } : o));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    if (filter === 'PACKED') return order.status === 'READY';
    // RECEIVED is default for "Processing". We also check it's not closed/delivered if looking strictly for unpacked active orders
    if (filter === 'UNPACKED') return (order.status === 'RECEIVED' || order.status === 'RECIVED') && order.is_open;
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* 1. Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => router.push('/')}
          className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <X size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-800 leading-tight">All Orders</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {search ? 'Searching Database...' : `Date: ${new Date(dateFilter).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </p>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="px-4 py-4 space-y-3 bg-white border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search last 4 digits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {!search && (
          <div className="flex flex-col gap-3">
             <div className="flex gap-3">
                <div className="flex-1 relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                     <Calendar size={14} />
                   </div>
                   <input 
                     type="date" 
                     value={dateFilter}
                     onChange={(e) => setDateFilter(e.target.value)}
                     className="w-full pl-9 pr-2 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 outline-none border-0"
                   />
                </div>
                <button 
                  onClick={() => setShowClosed(!showClosed)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    showClosed 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {showClosed ? <Archive size={14} /> : <Filter size={14} />}
                  {showClosed ? 'All' : 'Active'}
                </button>
             </div>

             <div className="flex p-1 space-x-1 bg-slate-100 rounded-xl">
                {['ALL', 'UNPACKED', 'PACKED'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab as any)}
                    className={`
                      flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all
                      ${filter === tab 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'}
                    `}
                  >
                    {tab}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* 3. List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-2">
             <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
             <p className="text-xs font-bold">Loading...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-2">
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
              <FileText size={20} />
            </div>
            <p className="text-xs">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isPaid = order.payment_status === 'PAID';
            const isOpen = order.is_open;
            const isPacked = order.status === 'READY';
            const isClosed = !isOpen; // Derived from isOpen for clarity
            
            // Due Date Logic
            const dueDate = new Date(order.due_date);
            const isOverdue = new Date() > dueDate && isOpen;

            return (
              <div key={order.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all">
                
                {/* CARD HEADER */}
                <div 
                  onClick={() => setExpandedId(expandedId ? null : order.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Status Icon Logic */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isClosed 
                        ? 'bg-slate-100 text-slate-400'
                        : isPacked 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-amber-100 text-amber-600'
                    }`}>
                      {isClosed 
                        ? <CheckCheck size={18} />
                        : isPacked 
                          ? <CheckCircle size={18} /> 
                          : <Clock size={18} />
                      }
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{order.customers?.name}</span>
                        {/* Status Badge */}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                           isClosed
                           ? 'bg-slate-50 text-slate-500 border-slate-100'
                           : isPacked 
                             ? 'bg-green-50 text-green-700 border-green-200' 
                             : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isClosed ? 'Delivered' : isPacked ? 'Ready' : 'Processing'}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono bg-slate-50 px-1 rounded text-slate-500">{order.readable_bill_id}</span>
                        <span>•</span>
                        <span className={isPaid ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                          {isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                        <span>•</span>
                        <span>₹{order.final_amount}</span>
                      </p>
                    </div>
                  </div>
                  
                  {expandedId === order.id ? <ChevronUp size={18} className="text-slate-300" /> : <ChevronDown size={18} className="text-slate-300" />}
                </div>

                {/* EXPANDED DETAILS */}
                {expandedId === order.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-50 bg-slate-50/30">
                    
                    <div className="grid grid-cols-2 gap-4 py-3 mb-2">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Contact</span>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <AlertCircle size={14} className="text-blue-400" /> 
                            {order.customers?.phone}
                          </div>
                       </div>
                       <div className="flex flex-col gap-1 items-end">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Due Date</span>
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                             <CalendarDays size={14} />
                             {dueDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 p-2 mb-3 shadow-xs">
                      <table className="w-full text-xs">
                        <thead>
                            <tr className="text-[10px] text-slate-400 border-b border-slate-50">
                                <th className="text-left pb-2 pl-2 font-medium uppercase tracking-wider">Item Details</th>
                                <th className="text-right pb-2 pr-2 font-medium uppercase tracking-wider">Qty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {order.order_items?.map((item: any, idx: number) => (
                            <tr key={idx} className="text-slate-700">
                              <td className="py-2.5 pl-2">
                                <div className="font-bold text-sm text-slate-800">{item.item_name_snapshot}</div>
                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide bg-slate-50 inline-block px-1.5 rounded mt-0.5">
                                  {item.service_type}
                                </div>
                              </td>
                              <td className="py-2.5 text-right pr-2">
                                 <span className="font-bold text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                                   x {item.quantity}
                                 </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t border-slate-100 bg-slate-50/50">
                           <tr>
                              <td className="py-2 pl-2 text-[10px] font-bold text-slate-500 uppercase">
                                 Total Items: <span className="text-slate-900 text-xs ml-1">{order.total_piece_count}</span>
                              </td>
                              <td className="py-2 pr-2 text-right text-[10px] font-bold text-slate-500 uppercase">
                                 Total Bill: <span className="text-slate-900 text-xs ml-1">₹{order.final_amount}</span>
                              </td>
                           </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest flex items-center gap-1">
                          <FileText size={10} /> Note
                        </span>
                        {editingNoteId !== order.id && (
                          <button 
                            onClick={() => startEditNote(order)} 
                            className="text-[10px] text-yellow-600 font-bold hover:underline"
                          >
                            {order.notes ? 'Edit' : 'Add'}
                          </button>
                        )}
                      </div>

                      {editingNoteId === order.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea 
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full p-2 text-xs bg-white border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                            rows={2}
                            placeholder="Type special instructions..."
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingNoteId(null)} className="text-xs text-slate-400 font-medium px-2">Cancel</button>
                            <button 
                              onClick={() => handleSaveNote(order.id)}
                              className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-yellow-200"
                            >
                              <Save size={12} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 italic">
                          {order.notes || "No notes."}
                        </p>
                      )}
                    </div>

                    {/* 4. Action Buttons (Updated Condition) */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        {isClosed ? (
                           <div className="flex items-center gap-2 text-slate-500 text-xs font-bold px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 w-full justify-center">
                              <CheckCheck size={16} />
                              Order Delivered
                           </div>
                        ) : isPacked ? (
                           <div className="flex items-center gap-2 text-green-600 text-xs font-bold px-4 py-2.5 bg-green-50 rounded-xl border border-green-200 w-full justify-center">
                              <CheckCircle size={16} />
                              Ready for Delivery
                           </div>
                        ) : (
                          <button
                            disabled={loadingId === order.id}
                            onClick={(e) => handleMarkAsPacked(e, order.id)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200 hover:bg-blue-700"
                          >
                            {loadingId === order.id ? (
                              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span> 
                            ) : (
                              <Package size={16} />
                            )}
                            Mark as Packed
                          </button>
                        )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}