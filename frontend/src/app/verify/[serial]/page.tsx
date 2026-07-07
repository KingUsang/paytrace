'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConsumerVerificationPage({ params }: { params: { serial: string } }) {
  const [status, setStatus] = useState<'verifying' | 'genuine' | 'failed'>('verifying');

  useEffect(() => {
    // Simulate a network call to the PayTrace blockchain/database
    const timer = setTimeout(() => {
      // For demonstration: If the serial ends with 'F', make it fail. Otherwise, genuine.
      if (params.serial.toUpperCase().endsWith('F')) {
        setStatus('failed');
      } else {
        setStatus('genuine');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [params.serial]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md w-full relative">
      
      {/* Abstract background pattern for Genuine state */}
      {status === 'genuine' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-50 z-0" 
          style={{
            backgroundImage: 'radial-gradient(var(--tw-colors-outline-variant) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {/* TopAppBar */}
      <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 sticky top-0 z-50">
        <div className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-primary tracking-tight">PayTrace</div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full p-2 font-label-caps text-label-caps font-bold">
            PORTAL
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-gutter max-w-container-max-width mx-auto w-full z-10 py-12">
        
        {/* --- STATE: VERIFYING --- */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center text-center animate-pulse">
            <span className="material-symbols-outlined text-6xl text-outline-variant animate-spin mb-6" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Verifying Ledger...</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Checking cryptographic signatures across the supply chain.</p>
          </div>
        )}

        {/* --- STATE: GENUINE --- */}
        {status === 'genuine' && (
          <div className="w-full max-w-md flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]">
            
            <section className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-fixed flex items-center justify-center mb-6 shadow-lg relative overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-secondary z-10" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <div className="absolute inset-0 bg-secondary opacity-20 blur-xl rounded-full"></div>
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 tracking-tight">Genuine Product</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px]">
                This item has been cryptographically authenticated and its custody chain is secure.
              </p>
            </section>

            {/* Product Details Card */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>inventory_2</span>
                <h2 className="font-title-md text-title-md text-primary">Product Details</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-outline-variant border-dashed pb-3 last:border-0 last:pb-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">PRODUCT</span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold text-right">Premium Engine Oil 5W-30</span>
                </div>
                <div className="flex justify-between items-start border-b border-outline-variant border-dashed pb-3 last:border-0 last:pb-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">SERIAL ID</span>
                  <span className="font-data-mono text-data-mono text-primary bg-surface-container px-2 py-1 rounded font-bold">{params.serial}</span>
                </div>
                <div className="flex justify-between items-start border-b border-outline-variant border-dashed pb-3 last:border-0 last:pb-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">ORIGIN</span>
                  <span className="font-body-md text-body-md text-on-surface text-right">Global ChemCorp Ltd.</span>
                </div>
              </div>
            </section>

            {/* Lineage View */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h2 className="font-title-md text-title-md text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>account_tree</span>
                Custody Chain
              </h2>
              <div className="relative ml-4 border-l-2 border-outline-variant flex flex-col gap-8 pb-4">
                {/* Hop 1 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">Manufacturer</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">Global ChemCorp Ltd.</span>
                    <div className="mt-2 bg-surface-container-low border-l-2 border-secondary rounded-r pl-3 pr-2 py-2 flex items-center gap-2 max-w-fit">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-body-sm text-body-sm text-primary font-medium">Verified by Nomba Payment</span>
                    </div>
                  </div>
                </div>
                {/* Hop 2 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">Distributor</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">Logistics Prime NA</span>
                    <div className="mt-2 bg-surface border border-outline-variant rounded pl-3 pr-2 py-2 flex items-center gap-2 max-w-fit">
                      <span className="material-symbols-outlined text-outline text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Custody Confirmed</span>
                    </div>
                  </div>
                </div>
                {/* Hop 3 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest animate-pulse"></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">Retailer</span>
                    <span className="font-body-md text-body-md text-primary font-semibold">Auto Parts Hub</span>
                    <div className="mt-2 bg-surface border border-outline-variant rounded pl-3 pr-2 py-2 flex items-center gap-2 max-w-fit">
                      <span className="material-symbols-outlined text-outline text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>storefront</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Current Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reward CTA */}
            <section className="bg-primary-container rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-secondary opacity-20 blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <span className="material-symbols-outlined text-4xl text-[#fadfb8]" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                <div>
                  <h2 className="font-title-md text-title-md text-on-primary mb-1 tracking-tight">Claim Your Reward</h2>
                  <p className="font-body-sm text-body-sm text-on-primary-container opacity-90">
                    Thank you for verifying. Enter your phone number linked to your Nomba account to receive your cashback reward.
                  </p>
                </div>
                <div className="w-full mt-2">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 material-symbols-outlined text-outline-variant text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>call</span>
                    <input 
                      className="w-full bg-inverse-surface border border-outline-variant text-on-primary rounded-lg pl-10 pr-4 py-3 font-data-mono text-data-mono focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-outline" 
                      placeholder="+234 800 000 0000" 
                      type="tel" 
                    />
                  </div>
                </div>
                <button className="w-full bg-secondary text-on-secondary font-body-md text-body-md font-semibold py-3 px-6 rounded-lg flex justify-center items-center gap-2 hover:bg-secondary-container transition-colors active:scale-95 duration-200">
                  Claim via Nomba
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </button>
                <span className="font-label-caps text-label-caps text-outline text-center mt-2 opacity-70 uppercase tracking-widest">Powered by PayTrace</span>
              </div>
            </section>

          </div>
        )}

        {/* --- STATE: FAILED --- */}
        {status === 'failed' && (
          <div className="w-full max-w-2xl flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Alert Banner */}
            <div className="bg-error-container text-on-error-container border-l-4 border-error rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-[0_0_0_rgba(186,26,26,0.4)] animate-[pulseError_2s_infinite]">
              <span className="material-symbols-outlined text-6xl text-error flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div className="flex flex-col gap-2 text-center md:text-left w-full">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-error tracking-tight font-bold">Unrecognized Product</h1>
                <p className="font-body-md text-body-md text-on-error-container font-semibold">Verification Failed: Invalid Chain of Custody.</p>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                <h2 className="font-title-md text-title-md text-on-surface">Scan Details</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outline-variant border-dashed pb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Scanned ID</span>
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">{params.serial}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant border-dashed pb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Location IP</span>
                  <span className="font-body-sm text-body-sm text-on-surface">192.168.1.4 (Flagged)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Timestamp</span>
                  <span className="font-body-sm text-body-sm text-on-surface">{new Date().toUTCString()}</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-primary text-on-primary font-title-md text-title-md py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>report</span>
                Report Counterfeit
              </button>
              <div className="bg-[#fadfb8] text-[#271902] rounded-lg p-4 flex flex-col items-center justify-center border border-[#ddc39d] text-center shadow-sm">
                <span className="material-symbols-outlined text-3xl mb-1 text-[#564427]" style={{ fontVariationSettings: "'FILL' 0" }}>stars</span>
                <span className="font-title-md text-title-md tracking-tight font-bold">Claim Reward</span>
                <span className="font-body-sm text-body-sm mt-1 opacity-90">Help us stop fraud and earn points.</span>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/" className="bg-transparent text-primary font-body-md text-body-md font-semibold border border-outline-variant py-3 px-8 rounded-lg hover:bg-surface-container-low transition-colors">
                Cancel & Return
              </Link>
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseError {
            0% { box-shadow: 0 0 0 0 rgba(186, 26, 26, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(186, 26, 26, 0); }
            100% { box-shadow: 0 0 0 0 rgba(186, 26, 26, 0); }
        }
      `}} />
    </div>
  );
}
