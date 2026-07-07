'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReceivablesPage() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  useEffect(() => {
    const fetchReceivables = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/allocations`);
        const data = await res.json();
        
        const creditAllocations = data.filter((a: any) => a.declared_terms === 'CREDIT' || a.credit_term_days !== null);
        
        let total = 0;
        const formatted = creditAllocations.map((item: any) => {
          const amount = item.quantity * Number(item.batch?.unit_price || 50);
          if (item.status !== 'PAYMENT_VERIFIED') {
            total += amount;
          }
          return {
            id: item.id.split('-')[0],
            entity: item.to_participant?.phone_number || 'Unknown',
            amount: amount,
            due_date: new Date(new Date(item.created_at).getTime() + (item.credit_term_days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: item.status,
          };
        });
        
        setReceivables(formatted);
        setTotalOutstanding(total);
      } catch (error) {
        console.error('Error fetching receivables', error);
      }
    };
    fetchReceivables();
    const interval = setInterval(fetchReceivables, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop pb-24 md:pb-12 max-w-[1280px] w-full mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-1">Receivables Aging</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Live mini AR ledger showing credit-based batch cycles.</p>
        </div>
        {/* Summary Metrics */}
        <div className="flex gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)] min-w-[140px]">
            <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Total Outstanding</span>
            <span className="font-data-mono text-data-mono text-lg font-bold text-on-background">₦{totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-error-container border border-error/20 rounded-lg px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)] min-w-[140px]">
            <span className="font-label-caps text-label-caps text-on-error-container block mb-1">60+ Days Overdue</span>
            <span className="font-data-mono text-data-mono text-lg font-bold text-error">₦84.2K</span>
          </div>
        </div>
      </div>

      {/* Controls & Filters Layer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-4 py-2 bg-primary text-on-primary font-body-sm text-body-sm rounded shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all">All Batches</button>
          <button className="px-4 py-2 border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low font-body-sm text-body-sm rounded transition-all">Overdue</button>
          <button className="px-4 py-2 border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low font-body-sm text-body-sm rounded transition-all">Near Due</button>
        </div>
        {/* Action */}
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary font-body-sm text-body-sm rounded hover:brightness-110 transition-all shadow-sm">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
          Export Ledger
        </button>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider">Batch ID</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider">Recipient Entity</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider text-right">Amount</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider">Due Date</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider">Aging Status</th>
                <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-gutter font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              
              {receivables.length > 0 ? receivables.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface transition-colors group">
                  <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background">{item.id}</td>
                  <td className="py-4 px-gutter font-body-sm text-body-sm text-on-background">{item.entity}</td>
                  <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background text-right">₦{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-4 px-gutter font-data-mono text-data-mono text-on-surface-variant">{item.due_date}</td>
                  <td className="py-4 px-gutter">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded ${item.status === 'PAYMENT_VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>{item.status === 'PAYMENT_VERIFIED' ? 'check_circle' : 'schedule'}</span>
                      <span className="font-label-caps text-label-caps">{item.status === 'PAYMENT_VERIFIED' ? 'Settled' : 'Current'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-gutter text-right">
                    <button className="text-secondary hover:text-on-secondary-fixed font-body-sm text-body-sm font-semibold transition-colors">Details</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">No credit allocations found.</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-surface-container-lowest border-t border-outline-variant px-gutter py-3 flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {receivables.length} batches</span>
          <div className="flex gap-1">
            <button className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
            </button>
            <button className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
