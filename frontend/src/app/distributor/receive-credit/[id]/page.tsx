'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReceiveCreditPage({ params }: { params: { id: string } }) {
  const [isScanning, setIsScanning] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleScanClick = () => {
    setIsScanning(true);
    // Simulate barcode scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setOtpSent(true);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    // Simulate OTP verification and DB update
    setTimeout(() => {
      alert('Custody Confirmed! The attestation transaction has been logged.');
      router.push('/distributor/inventory');
    }, 2000);
  };

  return (
    <div className="flex-1 w-full max-w-container-max-width mx-auto flex flex-col pt-6 px-margin-mobile md:px-margin-desktop pb-32">
      {/* Transaction Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/distributor/inventory" className="text-primary hover:bg-surface-container-low transition-colors rounded-full p-2 border border-outline-variant inline-flex">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-primary">Receive Batch</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full border border-secondary-fixed-dim w-auto justify-center">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>credit_score</span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider hidden sm:inline">Credit Transfer</span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Batch Details */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          {/* Main Manifest Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
            <div className="bg-surface-container-low px-gutter py-4 border-b border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-surface-tint" style={{ fontVariationSettings: "'FILL' 0" }}>inventory_2</span>
              <h2 className="font-title-md text-title-md text-on-surface">Batch Manifest</h2>
            </div>
            
            <div className="p-gutter flex flex-col gap-6">
              {/* Meta Data Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest">Batch ID</p>
                  <p className="font-data-mono text-data-mono text-primary">{params.id || 'BCH-9942-AXK'}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest">Date Issued</p>
                  <p className="font-body-sm text-body-sm text-primary">Oct 24, 2026</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest">Sender</p>
                  <p className="font-body-sm text-body-sm text-primary font-semibold">Acme Logistics Corp.</p>
                </div>
              </div>
              
              <hr className="border-outline-variant" />
              
              {/* Contents Table */}
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase tracking-widest">Contents</p>
                <div className="border border-outline-variant rounded bg-surface-container-low overflow-hidden">
                  <div className="grid grid-cols-12 bg-surface-variant text-on-surface px-4 py-2 border-b border-outline-variant font-label-caps text-label-caps">
                    <div className="col-span-6 md:col-span-8">Item Description</div>
                    <div className="col-span-3 md:col-span-2 text-right">Qty</div>
                    <div className="col-span-3 md:col-span-2 text-right">Unit Val</div>
                  </div>
                  <div className="grid grid-cols-12 px-4 py-3 border-b border-outline-variant hover:bg-surface transition-colors items-center bg-surface-container-lowest">
                    <div className="col-span-6 md:col-span-8 font-body-sm text-body-sm">Premium Cement Bags (50kg)</div>
                    <div className="col-span-3 md:col-span-2 text-right font-data-mono text-data-mono">500</div>
                    <div className="col-span-3 md:col-span-2 text-right font-data-mono text-data-mono">₦6,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Action Panel */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          {/* Action Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-gutter shadow-[0_4px_12px_rgba(30,41,59,0.05)] sticky top-24">
            
            {!otpSent ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high text-primary mb-4 border border-outline-variant">
                    <span className={`material-symbols-outlined text-[32px] ${isScanning ? 'animate-pulse text-secondary' : ''}`} style={{ fontVariationSettings: "'FILL' 0" }}>qr_code_scanner</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-primary mb-2">Confirm Receipt</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Scan the batch barcode to verify contents and confirm physical custody.
                  </p>
                </div>

                {/* Trust Framework Notice */}
                <div className="bg-surface-container flex items-start gap-3 p-4 rounded border border-outline-variant mb-6">
                  <span className="material-symbols-outlined text-[20px] text-surface-tint mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <div className="flex-1">
                    <p className="font-label-caps text-label-caps text-on-surface mb-1">Identity Verified</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-relaxed">
                      Confirmation is strictly tied to your BVN-verified identity. An OTP will be required upon scanning.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleScanClick}
                  disabled={isScanning}
                  className="w-full bg-primary hover:bg-inverse-surface text-on-primary font-body-md text-body-md font-semibold py-4 rounded flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>document_scanner</span>
                  {isScanning ? 'Scanning...' : 'Scan to Confirm Receipt'}
                </button>
              </>
            ) : (
              <>
                {/* OTP Verification State */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-fixed text-secondary mb-4 border border-secondary-fixed-dim">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-primary mb-2">Sign Attestation</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Enter the 6-digit code sent to your verified phone number to accept custody.
                  </p>
                </div>

                <div className="mb-6">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-surface text-center font-display-lg text-[32px] p-4 rounded-lg border border-outline-variant focus:border-secondary focus:outline-none tracking-widest"
                  />
                </div>

                <button 
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-body-md text-body-md font-semibold py-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? (
                    <><span className="material-symbols-outlined animate-spin text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span> Verifying...</>
                  ) : (
                    'Accept Liability & Confirm'
                  )}
                </button>
              </>
            )}

            <button className="w-full mt-3 bg-transparent border border-outline hover:bg-surface-container-low text-primary font-body-sm text-body-sm font-semibold py-3 rounded transition-colors">
              Report Discrepancy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
