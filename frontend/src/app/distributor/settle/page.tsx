'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Allocation {
  id: string;
  recipient: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'verified';
}

const mockAllocations: Allocation[] = [
  { id: 'INV-4091-XX', recipient: 'Acme Corp Logistics', amount: 12450.00, dueDate: 'Oct 12, 2026', status: 'pending' },
  { id: 'INV-4092-XY', recipient: 'Global Freight Solutions', amount: 8210.50, dueDate: 'Oct 14, 2026', status: 'pending' },
  { id: 'INV-4095-ZZ', recipient: 'Delta Cargo Inc.', amount: 45100.00, dueDate: 'Oct 15, 2026', status: 'pending' },
];

export default function SettleOutstandingPage() {
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSettling, setIsSettling] = useState(false);
  const [paymentVA, setPaymentVA] = useState<string | null>(null);
  const [paymentBatchId, setPaymentBatchId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verified' | null>(null);

  const totalBulkAmount = 65760.50;

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === allocations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allocations.map(a => a.id)));
    }
  };

  const selectedTotal = allocations
    .filter(a => selectedIds.has(a.id))
    .reduce((sum, a) => sum + a.amount, 0);

  const remaining = totalBulkAmount - selectedTotal;
  const percentage = Math.min((selectedTotal / totalBulkAmount) * 100, 100);

  const handleSettle = async () => {
    if (selectedIds.size === 0) return;
    setIsSettling(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/settlements/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedTotal, reference: 'BP-90821A' })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setPaymentVA(data.accountNumber);
      setPaymentBatchId(data.id);
      setPaymentStatus('pending');
      setIsSettling(false);
    } catch(err) {
      console.error(err);
      setIsSettling(false);
      alert('Failed to provision Nomba Virtual Account. Check if backend is running.');
    }
  };

  // Poll for status updates
  useEffect(() => {
    if (!paymentBatchId || paymentStatus !== 'pending') return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/settlements/${paymentBatchId}/status`);
        const data = await res.json();
        if (data.status === 'PAYMENT_VERIFIED') {
          setPaymentStatus('verified');
          clearInterval(interval);
          // Mark selected as verified after successful payment
          setAllocations(prev => prev.map(a => 
            selectedIds.has(a.id) ? { ...a, status: 'verified' } : a
          ));
          setSelectedIds(new Set());
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [paymentBatchId, paymentStatus, selectedIds]);

  return (
    <div className="flex-1 flex flex-col h-full w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-[24px]">
      
      {/* Page Header */}
      <div className="mb-[24px] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Manual Reconciliation</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Bulk Payment Reference: #BP-90821A</p>
        </div>
        <div className="flex gap-3">
          <Link href="/distributor/inventory" className="bg-surface border border-outline text-on-surface font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors">
            Cancel
          </Link>
          <button 
            onClick={handleSettle}
            disabled={selectedIds.size === 0 || isSettling}
            className="bg-primary text-on-primary font-body-md text-body-md px-6 py-2 rounded-lg shadow-sm transition-opacity flex items-center gap-2 disabled:opacity-50 hover:opacity-90"
          >
            {isSettling ? (
              <span className="material-symbols-outlined animate-spin text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>done_all</span>
            )}
            Settle Selected
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
        
        {/* Allocation List */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          {/* List Header */}
          <div className="bg-surface-container-low border-b border-outline-variant p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer" 
                checked={selectedIds.size === allocations.length && allocations.length > 0}
                onChange={toggleAll}
              />
              <span className="font-title-md text-title-md text-primary">Pending Allocations</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-surface p-1 rounded">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Filter</span>
            </div>
          </div>

          {/* List Body */}
          <div className="flex-1 overflow-y-auto p-[16px] space-y-[8px]">
            {allocations.map(allocation => {
              const isChecked = selectedIds.has(allocation.id);
              const isVerified = allocation.status === 'verified';
              return (
                <label key={allocation.id} className="block relative cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isChecked}
                    disabled={isVerified}
                    onChange={() => toggleSelection(allocation.id)}
                  />
                  <div className={`flex items-center p-[16px] rounded-lg border transition-colors duration-200 
                    ${isVerified ? 'bg-emerald-50 border-emerald-200' : isChecked ? 'bg-emerald-50/50 border-emerald-500 shadow-sm' : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                    
                    <div className="mr-4 flex-shrink-0">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        ${isChecked || isVerified ? 'bg-secondary border-secondary' : 'border-outline-variant'}
                      `}>
                        {(isChecked || isVerified) && (
                          <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
                      <div className="flex flex-col">
                        <span className="font-data-mono text-data-mono text-primary">{allocation.id}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{allocation.recipient}</span>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <span className="font-data-mono text-data-mono text-primary text-lg">${allocation.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Due: {allocation.dueDate}</span>
                      </div>
                    </div>

                    <div className="ml-4 md:ml-8 flex-shrink-0 w-36 flex justify-end">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                        ${isVerified || isChecked ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-surface-container-high text-on-surface border border-outline-variant'}
                      `}>
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: isChecked || isVerified ? "'FILL' 1" : "'FILL' 0" }}>
                          {isVerified || isChecked ? 'check_circle' : 'pending'}
                        </span>
                        <span>{isVerified || isChecked ? 'Payment Verified' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Ledger / Summary Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-[24px]">
          {/* Incoming Bulk Payment Details */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-[24px] shadow-[0_4px_12px_rgba(33,49,69,0.05)]">
            <h2 className="font-title-md text-title-md text-primary mb-[16px] flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
              Bulk Deposit
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Source</span>
                <span className="font-data-mono text-data-mono text-primary text-right">WIRE-USBANK-992</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Total Amount</span>
                <span className="font-data-mono text-data-mono text-primary text-xl font-bold">${totalBulkAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Date Received</span>
                <span className="font-data-mono text-data-mono text-primary">Oct 16, 2026 09:14 AM</span>
              </div>
            </div>
          </div>

          {/* Reconciliation Summary */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant p-[24px]">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-[16px] uppercase tracking-widest">Reconciliation Ledger</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Selected Amount</span>
                <span className="font-data-mono text-data-mono text-secondary">${selectedTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining Unallocated</span>
                <span className={`font-data-mono text-data-mono ${percentage >= 100 ? 'text-emerald-600' : 'text-primary'}`}>
                  ${remaining.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </span>
              </div>
            </div>

            {/* Visual Balance Bar */}
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-300 ${percentage >= 100 ? 'bg-emerald-500' : 'bg-secondary'}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="font-label-caps text-label-caps text-right text-on-surface-variant">{percentage.toFixed(0)}% Allocated</p>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {paymentVA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-md w-full shadow-2xl relative">
            
            {paymentStatus === 'pending' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Awaiting Payment</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  Please transfer <strong className="text-primary font-data-mono">${selectedTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong> to the virtual account below to settle this batch.
                </p>

                <div className="bg-surface-container-low p-6 rounded-lg mb-8 border border-outline-variant">
                  <div className="mb-4">
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Bank Name</div>
                    <div className="font-title-md text-primary font-bold">Nomba</div>
                  </div>
                  <div>
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Account Number</div>
                    <div className="font-display-lg text-secondary font-black tracking-widest">{paymentVA}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-on-surface-variant font-body-sm">
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Waiting for webhook confirmation...
                </div>

                <button 
                  onClick={() => setPaymentVA(null)}
                  className="mt-6 text-primary hover:text-on-surface-variant underline font-body-sm transition-colors"
                >
                  Cancel & Close
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 border-4 border-emerald-50">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-emerald-700 mb-2">Payment Verified!</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  We successfully received the transfer via Nomba webhook. The allocations have been marked as paid.
                </p>
                <button 
                  onClick={() => setPaymentVA(null)}
                  className="bg-primary text-on-primary w-full py-3 rounded-lg font-title-md hover:bg-inverse-surface transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
