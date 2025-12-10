'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Truck, Store, AlertCircle, SquareActivity, Clock } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  readable_bill_id: string;
  final_amount: number;
  amount_paid: number;
  payment_status: string;
  delivery_mode: 'PICKUP' | 'DELIVERY';
  due_date: string; // Ensure this is selected in your server action
  customers: {
    name: string;
    phone: string;
  };
}

interface HomeOrderListsProps {
  data: {
    overdue: OrderItem[];
    dueDelivery: OrderItem[];
    duePickup: OrderItem[];
  };
}

export default function HomeOrderLists({ data }: HomeOrderListsProps) {
  const [activeTab, setActiveTab] = useState<'OVERDUE' | 'DELIVERY' | 'PICKUP'>('OVERDUE');

  // Helper: Calculate days overdue
  const getDaysOverdue = (dateStr: string) => {
    const due = new Date(dateStr);
    const today = new Date();
    // Reset time to midnight for accurate day diff
    due.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - due.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const getList = () => {
    switch (activeTab) {
      case 'DELIVERY': return data.dueDelivery;
      case 'PICKUP': return data.duePickup;
      default: 
        // Sort overdue: Oldest due date first (Most delayed)
        return [...data.overdue].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    }
  };

  const list = getList();

  const handleWhatsApp = (order: OrderItem) => {
    const rawPhone = order.customers?.phone || '';
    let phone = rawPhone.replace(/\D/g, ''); 

    if (!phone || phone.length < 10) {
      alert(`Invalid or missing phone number for ${order.customers.name}`);
      return;
    }
    if (phone.length === 10) phone = '91' + phone;

    const pending = order.final_amount - order.amount_paid;
    
    let text = '';
    if (activeTab === 'OVERDUE') {
       const days = getDaysOverdue(order.due_date);
       text = `Hello ${order.customers.name}, your laundry bill *${order.readable_bill_id}* is overdue by ${days} days. Pending Amount: ₹${pending}. Please pay & collect.`;
    } else if (order.delivery_mode === 'DELIVERY') {
       text = `Hello ${order.customers.name}, your order *${order.readable_bill_id}* is out for delivery today. Total: ₹${order.final_amount}.`;
    } else {
       text = `Hello ${order.customers.name}, your order *${order.readable_bill_id}* is ready for pickup today.`;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* 1. Tab Navigation */}
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('OVERDUE')}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'OVERDUE' ? 'border-red-500 text-red-600 bg-red-50/50' : 'border-transparent text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1">
            <AlertCircle size={14} /> Overdue
          </div>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{data.overdue.length}</span>
        </button>

        <button 
          onClick={() => setActiveTab('DELIVERY')}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'DELIVERY' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1">
            <Truck size={14} /> Delivery
          </div>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{data.dueDelivery.length}</span>
        </button>

        <button 
          onClick={() => setActiveTab('PICKUP')}
          className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'PICKUP' ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1">
            <Store size={14} /> Pickup
          </div>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{data.duePickup.length}</span>
        </button>
      </div>

      {/* 2. List Content */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
        {list.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
               {activeTab === 'OVERDUE' ? <AlertCircle size={24} /> : activeTab === 'DELIVERY' ? <Truck size={24} /> : <Store size={24} />}
            </div>
            <p className="text-xs font-medium">All clear! No orders here.</p>
          </div>
        ) : (
          list.map((order) => {
            const pendingAmount = order.final_amount - order.amount_paid;
            const isPaid = order.payment_status === 'PAID';
            const overdueDays = activeTab === 'OVERDUE' ? getDaysOverdue(order.due_date) : 0;

            return (
              <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors group">
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{order.customers.name || 'Unknown'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {order.readable_bill_id}
                      </span>
                      
                      {/* Overdue Badge */}
                      {activeTab === 'OVERDUE' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 text-red-600 border-red-100 bg-red-50">
                          <Clock size={10} /> {overdueDays} Day{overdueDays !== 1 ? 's' : ''} Late
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">
                      {isPaid ? (
                        <span className="text-green-600 flex items-center gap-1 justify-end">PAID</span>
                      ) : (
                        <span className="text-red-600">Due Amount: ₹{pendingAmount}</span>
                      )}
                    </p>
                    
                    {/* Conditionally show Phone OR Overdue Text */}
                    {activeTab === 'OVERDUE' ? (
                       <p className="text-[9px] text-red-400 mt-0.5 font-bold">
                         Overdue by {overdueDays} day{overdueDays !== 1 ? 's' : ''}
                       </p>
                    ) : (
                       <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{order.customers.phone || 'No Phone'}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2 mt-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={`tel:${order.customers.phone}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition-colors active:scale-95"
                  >
                    <Phone size={12} /> Call
                  </a>
                  <button 
                    onClick={() => handleWhatsApp(order)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition-colors border border-green-100 active:scale-95"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </button>
                  
                  {/* Manage Button */}
                  <Link
                    href={`/scan?id=${order.id}`}
                    className="flex-none w-14 bg-slate-800 text-white hover:bg-slate-900 rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-md"
                    title="Manage Handover"
                  >
                    <SquareActivity size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}