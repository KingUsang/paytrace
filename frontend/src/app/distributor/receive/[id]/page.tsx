'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReceiveBatchCash({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Simulate a Nomba webhook verification after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('8023941102');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIHavePaid = () => {
    if (!isVerifying) {
      alert("Payment verified successfully by Nomba. Custody transferred!");
      router.push('/distributor/inventory');
    } else {
      alert("We are still waiting for Nomba to verify the payment. Please hold on.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-margin-mobile md:p-margin-desktop pt-8 pb-32 w-full max-w-container-max-width mx-auto">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 relative">
          <Link href="/distributor/claims" className="absolute -left-12 top-2 hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </Link>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">Confirm Receipt</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Review batch details and complete payment to finalize custody transfer.</p>
        </div>

        {/* Batch Summary Card */}
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="bg-[#F1F5F9] px-6 py-4 border-b border-outline-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>inventory_2</span>
            <h2 className="font-title-md text-title-md text-on-surface">Batch Summary</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant border-dashed">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Batch ID</span>
              <span className="font-data-mono text-data-mono text-on-surface font-bold">{params.id || 'BTH-2023-8894'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant border-dashed">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Contents</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold">50 Bags</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant border-dashed">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Description</span>
              <span className="font-body-md text-body-md text-on-surface">Agrochemicals (Premium Blend)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Sender declared terms</span>
              <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded text-primary font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span> Cash
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions Card */}
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)] relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
          <div className="p-6 flex flex-col gap-6 pl-8">
            <div className="flex items-start gap-4">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-title-md text-title-md text-on-surface tracking-tight">Payment Instructions</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Transfer the exact amount below to the provided Nomba Virtual Account to confirm receipt.</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Amount Due</span>
                <span className="font-display-lg text-display-lg text-primary tracking-tight">₦ 1,250,000</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Bank Name</span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold">Nomba</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono text-data-mono text-on-surface text-lg font-bold">802 394 1102</span>
                    <button onClick={handleCopy} className="text-secondary hover:bg-surface-container-high p-1 rounded transition-colors" title="Copy">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>{copied ? 'check' : 'content_copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Area */}
            <div className={`flex items-center justify-between p-4 rounded mt-2 transition-colors duration-500 ${isVerifying ? 'bg-surface-container' : 'bg-[#10b981]/10 border border-[#10b981]/30'}`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${isVerifying ? 'text-outline animate-spin' : 'text-[#10b981]'}`} style={{ fontVariationSettings: "'FILL' 0" }}>
                  {isVerifying ? 'sync' : 'check_circle'}
                </span>
                <span className={`font-body-sm text-body-sm italic ${isVerifying ? 'text-on-surface-variant' : 'text-[#10b981] font-semibold'}`}>
                  {isVerifying ? 'Waiting for payment confirmation...' : 'Payment verified by Nomba!'}
                </span>
              </div>
              
              {!isVerifying && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#10b981]/20 px-2 py-1 rounded border border-[#10b981]/30">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    <span className="font-label-caps text-label-caps text-[#10b981]">Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
          <Link href="/distributor/claims" className="px-6 py-3 border border-outline text-on-surface font-body-md text-body-md font-semibold rounded hover:bg-surface-container-low transition-colors w-full sm:w-auto text-center">
            Report Issue
          </Link>
          <button 
            onClick={handleIHavePaid}
            className={`px-6 py-3 font-body-md text-body-md font-semibold rounded shadow-sm transition-all w-full sm:w-auto flex justify-center items-center gap-2 
              ${isVerifying ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-on-secondary hover:opacity-90'}`}
          >
            I've Paid
          </button>
        </div>

      </div>
    </div>
  );
}
