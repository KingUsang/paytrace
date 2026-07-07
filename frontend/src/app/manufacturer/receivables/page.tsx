'use client';
import React from 'react';
import Link from 'next/link';

export default function ReceivablesPage() {
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
            <span className="font-data-mono text-data-mono text-lg font-bold text-on-background">$1.42M</span>
          </div>
          <div className="bg-error-container border border-error/20 rounded-lg px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)] min-w-[140px]">
            <span className="font-label-caps text-label-caps text-on-error-container block mb-1">60+ Days Overdue</span>
            <span className="font-data-mono text-data-mono text-lg font-bold text-error">$84.2K</span>
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
              
              {/* Row 1: Custody Confirmed */}
              <tr className="hover:bg-surface transition-colors group relative bg-surface-container-low/30">
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary"></div>
                  B-9021-XRF
                </td>
                <td className="py-4 px-gutter font-body-sm text-body-sm text-on-background font-medium">Apex Heavy Industries</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background text-right">$142,500.00</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-surface-variant">2026-11-15</td>
                <td className="py-4 px-gutter">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-secondary bg-secondary-fixed text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <span className="font-label-caps text-label-caps">Custody Confirmed</span>
                  </div>
                </td>
                <td className="py-4 px-gutter text-right">
                  <button className="text-secondary hover:text-on-secondary-fixed font-body-sm text-body-sm font-semibold transition-colors">Details</button>
                </td>
              </tr>

              {/* Row 2: Current */}
              <tr className="hover:bg-surface transition-colors group">
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background">B-8834-LMN</td>
                <td className="py-4 px-gutter font-body-sm text-body-sm text-on-background">Global Logistics Corp</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background text-right">$28,450.00</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-surface-variant">2026-11-20</td>
                <td className="py-4 px-gutter">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                    <span className="font-label-caps text-label-caps">Current</span>
                  </div>
                </td>
                <td className="py-4 px-gutter text-right">
                  <button className="text-secondary hover:text-on-secondary-fixed font-body-sm text-body-sm font-semibold transition-colors">Details</button>
                </td>
              </tr>

              {/* Row 3: 1-30 Days Overdue */}
              <tr className="hover:bg-surface transition-colors group">
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background">B-8199-KQP</td>
                <td className="py-4 px-gutter font-body-sm text-body-sm text-on-background">Nexus Supply Co.</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background text-right">$5,200.00</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-error font-bold">2026-10-10</td>
                <td className="py-4 px-gutter">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-fixed border border-tertiary-fixed-dim text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
                    <span className="font-label-caps text-label-caps">1-30 Days Overdue</span>
                  </div>
                </td>
                <td className="py-4 px-gutter text-right">
                  <button className="text-secondary hover:text-on-secondary-fixed font-body-sm text-body-sm font-semibold transition-colors">Details</button>
                </td>
              </tr>

              {/* Row 4: 61+ Days Overdue */}
              <tr className="hover:bg-surface transition-colors group relative bg-error-container/20">
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-error"></div>
                  B-7402-Zeta
                </td>
                <td className="py-4 px-gutter font-body-sm text-body-sm text-on-background font-bold">OmniCorp Manufacturing</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-on-background text-right">$84,200.00</td>
                <td className="py-4 px-gutter font-data-mono text-data-mono text-error font-bold">2026-08-15</td>
                <td className="py-4 px-gutter">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error text-on-error shadow-sm">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    <span className="font-label-caps text-label-caps">61+ Days Overdue</span>
                  </div>
                </td>
                <td className="py-4 px-gutter text-right">
                  <button className="text-error hover:text-on-error-container font-body-sm text-body-sm font-bold transition-colors">Action Required</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-surface-container-lowest border-t border-outline-variant px-gutter py-3 flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-4 of 128 batches</span>
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
