'use client';
import React from 'react';
import Link from 'next/link';

export default function BatchCustodyTree({ params }: { params: { id: string } }) {
  return (
    <div className="p-margin-mobile md:p-margin-desktop w-full max-w-[1280px] mx-auto">
      {/* Top Action Bar for sub-page */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/manufacturer/batches" className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
        </Link>
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">Batch Detail View</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Custody tracking and allocation history.</p>
        </div>
      </div>

      {/* Header Information Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-12 shadow-[0_4px_12px_rgba(33,49,69,0.02)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Batch ID</p>
            <p className="font-data-mono text-data-mono text-primary text-lg">#PT-{params.id || 'AUG-001'}</p>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Product Origin</p>
            <p className="font-body-md text-body-md text-primary font-medium">Dangote Cement 50kg</p>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Total Quantity</p>
            <p className="font-data-mono text-data-mono text-primary text-lg">1,000 Bags</p>
          </div>
        </div>
      </div>

      {/* Custody Tree Section */}
      <div className="mb-8">
        <h3 className="font-title-md text-title-md text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_tree</span>
          Custody Distribution Tree
        </h3>
        
        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] flex flex-col items-center pt-4">
            {/* Root Node: Manufacturer */}
            <div className="relative flex flex-col items-center">
              <div className="bg-surface-container-lowest border-2 border-primary rounded-lg p-4 w-64 shadow-sm z-10 text-center relative">
                <div className="absolute -top-3 -right-3 bg-secondary text-on-secondary w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">factory</span>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Origin Node</p>
                <p className="font-body-md text-body-md font-bold text-primary mb-2">Manufacturer HQ</p>
                <div className="bg-surface-container-low rounded p-2 inline-block">
                  <p className="font-data-mono text-data-mono text-primary">Qty: 1,000</p>
                </div>
              </div>
              {/* Line down from Root */}
              <div className="tree-line-v h-8"></div>
              {/* Horizontal Distribution Line */}
              <div className="relative w-[600px] h-8">
                <div className="absolute top-0 left-0 w-full tree-line-h"></div>
                {/* Drops to distributors */}
                <div className="absolute top-0 left-0 tree-line-v h-8"></div>
                <div className="absolute top-0 left-[50%] tree-line-v h-8 -ml-[1px]"></div>
                <div className="absolute top-0 right-0 tree-line-v h-8"></div>
              </div>
            </div>

            {/* Level 1: Distributors */}
            <div className="flex justify-between w-[600px] relative -mt-8 pt-16">
              {/* Distributor 1 */}
              <div className="flex flex-col items-center relative">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 w-56 shadow-sm z-10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Distributor</p>
                    <span className="material-symbols-outlined text-secondary icon-fill" title="Custody Confirmed" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  </div>
                  <p className="font-body-md text-body-md font-bold text-primary truncate">Alpha Logistics</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">+234 800 111 2222</p>
                  <div className="flex justify-between items-center bg-surface-container-low rounded p-2">
                    <span className="font-data-mono text-data-mono">400 Bags</span>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Confirmed</span>
                  </div>
                </div>
                {/* Line down to retailers */}
                <div className="tree-line-v h-8"></div>
                <div className="relative w-32 h-8">
                  <div className="absolute top-0 left-0 w-full tree-line-h"></div>
                  <div className="absolute top-0 left-0 tree-line-v h-8"></div>
                  <div className="absolute top-0 right-0 tree-line-v h-8"></div>
                </div>

                {/* Level 2: Retailers (under Dist 1) */}
                <div className="flex justify-between w-32 relative -mt-8 pt-16">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 w-28 shadow-sm z-10 text-center">
                    <p className="font-body-sm text-body-sm font-bold text-primary truncate">Retail A</p>
                    <p className="font-data-mono text-data-mono text-on-surface-variant text-xs mt-1">150 Bags</p>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 w-28 shadow-sm z-10 text-center">
                    <p className="font-body-sm text-body-sm font-bold text-primary truncate">Retail B</p>
                    <p className="font-data-mono text-data-mono text-on-surface-variant text-xs mt-1">250 Bags</p>
                  </div>
                </div>
              </div>

              {/* Distributor 2 (Flagged) */}
              <div className="flex flex-col items-center relative">
                <div className="bg-error-container/10 border-2 border-error rounded-lg p-4 w-56 shadow-sm z-10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-label-caps text-label-caps text-error font-bold">Flagged Dist.</p>
                    <span className="material-symbols-outlined text-error" title="Payment Overdue" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
                  </div>
                  <p className="font-body-md text-body-md font-bold text-primary truncate">Bravo Supply Co</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">+234 800 333 4444</p>
                  <div className="flex justify-between items-center bg-surface-container-lowest rounded p-2 border border-error/30">
                    <span className="font-data-mono text-data-mono text-error">300 Bags</span>
                    <span className="text-[10px] font-bold text-error uppercase tracking-wide">Overdue</span>
                  </div>
                </div>
              </div>

              {/* Distributor 3 */}
              <div className="flex flex-col items-center relative">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 w-56 shadow-sm z-10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Distributor</p>
                    <span className="material-symbols-outlined text-[#35260c] icon-fill" title="Payment Verified" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <p className="font-body-md text-body-md font-bold text-primary truncate">Charlie Trade</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">+234 800 555 6666</p>
                  <div className="flex justify-between items-center bg-surface-container-low rounded p-2">
                    <span className="font-data-mono text-data-mono">300 Bags</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
