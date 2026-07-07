'use client';
import React from 'react';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-background pb-24 md:pb-margin-desktop overflow-y-auto w-full max-w-container-max-width mx-auto">
      
      {/* Page Header & Filters */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary mb-2">Audit Trail</h1>
          <p className="text-on-surface-variant font-body-md text-body-md">Immutable record of logistical actions and custody transfers.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
            <input 
              type="date" 
              className="w-full pl-10 pr-3 py-2 border border-outline rounded bg-surface text-on-surface font-body-sm text-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            <select className="w-full pl-10 pr-8 py-2 border border-outline rounded bg-surface text-on-surface font-body-sm text-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors appearance-none">
              <option value="">All Transactions</option>
              <option value="forwarded">Forwarded</option>
              <option value="received">Received</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_drop_down</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid Container */}
      <div className="w-full relative">
        
        {/* Timeline Item 1: Forwarded (Secondary Trust) */}
        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-[150px] top-6 bottom-[-24px] w-0.5 bg-outline-variant"></div>
          <div className="md:hidden absolute left-3 top-6 bottom-[-24px] w-0.5 bg-outline-variant"></div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
            {/* Date/Time Anchor (Desktop) */}
            <div className="hidden md:block w-[130px] text-right pt-4 pr-6 shrink-0">
              <div className="font-data-mono text-data-mono text-on-surface-variant">2026-10-27</div>
              <div className="font-data-mono text-label-caps text-on-surface-variant opacity-75">14:32:01 UTC</div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-0 md:left-[142px] top-4 w-4 h-4 rounded-full bg-surface border-2 border-secondary z-10"></div>
            
            {/* Content Card */}
            <div className="bg-surface border border-outline-variant rounded-lg p-4 md:p-gutter flex-1 shadow-sm hover:shadow-md transition-shadow">
              <div className="md:hidden mb-2">
                <div className="font-data-mono text-data-mono text-on-surface-variant">2026-10-27 • 14:32:01 UTC</div>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary bg-[#f0f4ff] p-1.5 rounded" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                  <h3 className="font-title-md text-title-md text-primary">Batch Forwarded</h3>
                </div>
                {/* Trust Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4ff] border border-[#dbeafe] rounded-full hidden sm:flex">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-label-caps text-label-caps text-secondary">Custody Confirmed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-outline-variant pt-4">
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Batch ID</div>
                  <div className="font-data-mono text-data-mono text-on-surface">BX-9942-A</div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Destination</div>
                  <div className="font-body-sm text-body-sm text-on-surface">Retail Hub Alpha, NY</div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Operator ID</div>
                  <div className="font-data-mono text-data-mono text-on-surface">OP-882-X</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 2: Received (Verified Trust) */}
        <div className="relative pl-8 md:pl-0">
          <div className="hidden md:block absolute left-[150px] top-6 bottom-[-24px] w-0.5 bg-outline-variant"></div>
          <div className="md:hidden absolute left-3 top-6 bottom-[-24px] w-0.5 bg-outline-variant"></div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
            <div className="hidden md:block w-[130px] text-right pt-4 pr-6 shrink-0">
              <div className="font-data-mono text-data-mono text-on-surface-variant">2026-10-26</div>
              <div className="font-data-mono text-label-caps text-on-surface-variant opacity-75">09:15:44 UTC</div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-0 md:left-[142px] top-4 w-4 h-4 rounded-full bg-surface border-2 border-[#10b981] z-10"></div>
            
            <div className="bg-surface border-l-2 border-[#10b981] border-t border-r border-b border-outline-variant rounded-lg p-4 md:p-gutter flex-1 bg-[#f0fdf4]/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="md:hidden mb-2">
                <div className="font-data-mono text-data-mono text-on-surface-variant">2026-10-26 • 09:15:44 UTC</div>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] bg-[#dcfce7] p-1.5 rounded" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  <h3 className="font-title-md text-title-md text-primary">Inventory Received</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0fdf4] border border-[#dcfce7] rounded-full hidden sm:flex">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                  <span className="font-label-caps text-label-caps text-[#10b981]">Payment Verified</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#dcfce7] pt-4">
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Batch ID</div>
                  <div className="font-data-mono text-data-mono text-on-surface">BX-9942-A</div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Origin</div>
                  <div className="font-body-sm text-body-sm text-on-surface">Mfg Plant 04, TX</div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Transaction Ref</div>
                  <div className="font-data-mono text-data-mono text-on-surface">TXN-4491-ZV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Load More Indicator */}
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 border border-outline rounded-lg text-primary font-body-sm text-body-sm hover:bg-surface-container-low transition-colors active:bg-surface-container-high focus:outline-none">
            Load Previous Entries
          </button>
        </div>

      </div>
    </div>
  );
}
