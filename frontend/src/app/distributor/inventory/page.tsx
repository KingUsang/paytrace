'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

export default function FieldInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('paytrace_token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/allocations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const formatted = data.map((item: any) => ({
          id: item.id.split('-')[0],
          rawId: item.id,
          batch: item.batch.product_name,
          status: item.status === 'PAYMENT_VERIFIED' ? 'Payment Verified' : item.status === 'CUSTODY_CONFIRMED' ? 'Custody Confirmed' : 'Pending',
          statusColor: item.status === 'PAYMENT_VERIFIED' ? 'emerald' : item.status === 'CUSTODY_CONFIRMED' ? 'blue' : 'amber',
          qty: item.quantity,
          icon: item.status === 'PAYMENT_VERIFIED' ? 'check_circle' : 'verified_user'
        }));
        setInventory(formatted);
      } catch (error) {
        console.error('Error fetching inventory', error);
      }
    };
    fetchInventory();
    const interval = setInterval(fetchInventory, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredInventory = useMemo(() => {
    if (!searchQuery) return inventory;
    return inventory.filter(item => 
      item.batch.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, inventory]);

  const totalReceived = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.qty, 0);
  }, [inventory]);

  return (
    <div className="pt-6 pb-24 md:pb-8 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Field Inventory</h1>
          <p className="text-on-surface-variant font-body-md mt-1">Real-time custody tracking and forward allocation.</p>
        </div>
        <Link href={inventory.length > 0 ? `/distributor/allocate/${inventory[0].rawId}` : '#'} className={`bg-primary text-on-primary px-6 py-3 rounded-lg font-body-md font-semibold transition-opacity flex items-center justify-center w-full md:w-auto gap-2 shadow-[0_4px_12px_rgba(33,49,69,0.05)] ${inventory.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
          Allocate to Next Party
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
        <div className="bg-surface border border-outline-variant rounded-lg p-gutter shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(33,49,69,0.05)] transition-shadow">
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">Total Received</div>
          <div className="font-display-lg text-display-lg text-primary tracking-tight">{totalReceived.toLocaleString()}</div>
          <div className="text-body-sm text-[#10B981] mt-2 flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_upward</span>
            12% from last batch
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-gutter shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(33,49,69,0.05)] transition-shadow">
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">Available to Forward</div>
          <div className="font-display-lg text-display-lg text-primary tracking-tight">{totalReceived.toLocaleString()}</div>
          <div className="text-body-sm text-on-surface-variant mt-2 flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
            Pending allocation
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-surface border border-outline-variant rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="bg-[#F1F5F9] px-6 py-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="font-title-md text-title-md text-primary">Current Possession</h2>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-on-background font-body-sm focus:border-secondary focus:border-2 focus:outline-none transition-all" 
                placeholder="Search Batches..." 
                type="text" 
              />
            </div>
            <button className="px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            </button>
            <button className="px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-1 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {filteredInventory.length > 0 ? filteredInventory.map((item) => (
            <div 
              key={item.id}
              className={`p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-4 hover:brightness-95 transition-all
                ${item.statusColor === 'emerald' ? 'bg-[#10B981]/5 border-l-4 border-l-[#10B981]' : item.statusColor === 'blue' ? 'bg-[#0051d5]/5 border-l-4 border-l-[#0051d5]' : 'bg-amber-500/5 border-l-4 border-l-amber-500'}`
              }
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <span 
                    className={`material-symbols-outlined ${item.statusColor === 'emerald' ? 'text-[#10B981]' : item.statusColor === 'blue' ? 'text-[#0051d5]' : 'text-amber-500'}`} 
                    style={{ fontVariationSettings: item.statusColor === 'amber' ? "'FILL' 0" : "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <div className="font-body-md font-bold text-primary mb-1">{item.batch}</div>
                  <div className="font-data-mono text-data-mono text-on-surface-variant text-sm">ID: {item.id}</div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto mt-2 md:mt-0">
                <div className="text-left md:text-right">
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Status</div>
                  <div className={`font-body-sm font-semibold ${item.statusColor === 'emerald' ? 'text-[#10B981]' : item.statusColor === 'blue' ? 'text-[#0051d5]' : 'text-amber-500'}`}>
                    {item.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Quantity</div>
                  <div className="font-data-mono text-data-mono font-bold text-primary">{item.qty} Units</div>
                </div>
                
                {item.status === 'Pending' ? (
                  <Link href={`/distributor/receive/${item.rawId}`} className="bg-secondary text-on-secondary px-6 py-2 rounded font-body-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                    Receive Batch
                  </Link>
                ) : (
                  <Link href={`/distributor/allocate/${item.rawId}`} className="border border-outline text-on-surface hover:bg-surface-container-high px-6 py-2 rounded font-body-sm font-bold shadow-sm transition-colors">
                    Forward Batch
                  </Link>
                )}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-on-surface-variant">
              No inventory items found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
