'use client';
import React from 'react';

export default function AlertsPage() {
  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max-width mx-auto pb-24 md:pb-margin-desktop">
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Operational Anomalies</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Review and resolve critical flags in custody and payment streams.</p>
      </header>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Cash Mismatches (High Priority) */}
        <div className="md:col-span-8 bg-white/90 backdrop-blur-sm border border-outline-variant rounded-xl p-6 flex flex-col justify-between" style={{ background: 'rgba(186, 26, 26, 0.05)', borderLeft: '2px solid #ba1a1a' }}>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>money_off</span>
                <h3 className="font-title-md text-title-md text-primary">Cash Mismatches</h3>
              </div>
              <span className="bg-error-container text-on-error-container font-label-caps text-label-caps px-3 py-1 rounded-full">3 CRITICAL</span>
            </div>
            
            <div className="space-y-4 mb-8">
              {/* Item */}
              <div className="flex justify-between items-center border-b border-outline-variant pb-3 hover:bg-surface-container-low transition-colors px-2 rounded">
                <div>
                  <p className="font-data-mono text-data-mono text-primary">BATCH-992-A</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Declared: ₦4,500 | Received: ₦0</p>
                </div>
                <button className="bg-secondary text-on-secondary px-4 py-2 rounded font-body-sm text-body-sm hover:opacity-90">Investigate</button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="border border-outline text-primary px-4 py-2 rounded font-body-sm text-body-sm hover:bg-surface-container-low">View All Mismatches</button>
          </div>
        </div>

        {/* Chain Mismatches */}
        <div className="md:col-span-4 bg-white/90 backdrop-blur-sm border border-outline-variant rounded-xl p-6 flex flex-col justify-between" style={{ background: 'rgba(255, 165, 0, 0.05)', borderLeft: '2px solid orange' }}>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[orange] text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>link_off</span>
                <h3 className="font-title-md text-title-md text-primary">Chain Mismatches</h3>
              </div>
              <span className="font-data-mono text-data-mono font-bold text-[orange]">12 FLAGS</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Broken custody logic detected in transit manifests.</p>
            <ul className="space-y-2 font-data-mono text-data-mono text-sm">
              <li className="flex justify-between"><span>TRX-441</span> <span className="text-error">Missing Node</span></li>
              <li className="flex justify-between"><span>TRX-882</span> <span className="text-error">Time Sync</span></li>
            </ul>
          </div>
          <button className="w-full mt-6 bg-primary text-on-primary px-4 py-2 rounded font-body-sm text-body-sm hover:opacity-90">Flag Batch</button>
        </div>

        {/* Duplicate Claims */}
        <div className="md:col-span-6 bg-white/90 backdrop-blur-sm border border-outline-variant rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>file_copy</span>
            <h3 className="font-title-md text-title-md text-primary">Duplicate Claims</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Multiple consumer scans on same serial.</p>
          <div className="bg-surface-container-low p-4 rounded-lg">
            <div className="flex justify-between font-label-caps text-label-caps text-on-primary-container mb-2 border-b border-outline-variant pb-2">
              <span>Serial Number</span>
              <span>Scans</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-data-mono text-data-mono text-primary">
                <span>SN-0091-XX</span>
                <span className="font-bold text-error">4</span>
              </div>
              <div className="flex justify-between font-data-mono text-data-mono text-primary">
                <span>SN-4421-YY</span>
                <span className="font-bold text-error">2</span>
              </div>
            </div>
          </div>
          <button className="mt-6 border border-outline text-primary px-4 py-2 rounded font-body-sm text-body-sm hover:bg-surface-container-low w-full">Audit Claims</button>
        </div>

        {/* Partial Payments */}
        <div className="md:col-span-6 bg-white/90 backdrop-blur-sm border border-outline-variant rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>pie_chart</span>
            <h3 className="font-title-md text-title-md text-primary">Partial Payments</h3>
          </div>
          <div className="flex items-center justify-center h-32 mb-4 relative">
            {/* Placeholder for visual data representation */}
            <div className="w-24 h-24 rounded-full border-8 border-surface-container-high border-t-secondary-container animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute font-data-mono text-data-mono font-bold text-primary">8%</div>
          </div>
          <p className="font-body-sm text-body-sm text-center text-on-surface-variant mb-6">Of total volume requiring manual reconciliation.</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="border border-outline text-primary px-4 py-2 rounded font-body-sm text-body-sm hover:bg-surface-container-low">Export Data</button>
            <button className="bg-primary text-on-primary px-4 py-2 rounded font-body-sm text-body-sm hover:opacity-90">Reconcile</button>
          </div>
        </div>

      </div>
    </div>
  );
}
