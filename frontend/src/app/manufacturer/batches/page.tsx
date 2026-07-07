'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Mock Data
const MOCK_BATCHES = [
  { id: '#BX-8924-A', product: 'Lithium Ion Cells (Type C)', po: 'PO-2023-881', qty: '12,500', custodian: 'FreightLogistics Inc.', custodianInitials: 'FL', status: 'Payment Verified', statusColor: 'emerald', time: 'Cleared' },
  { id: '#BX-8925-B', product: 'Titanium Casings (Machined)', po: 'PO-2023-882', qty: '4,200', custodian: 'NavSea Transport', custodianInitials: 'NA', status: 'Custody Confirmed', statusColor: 'blue', time: 'Due in 5 days' },
  { id: '#BX-8921-A', product: 'Silicone Seals (Standard)', po: 'PO-2023-875', qty: '50,000', custodian: 'Warehouse 4 (Internal)', custodianInitials: 'WH', status: 'Settled', statusColor: 'surface', time: 'Closed' },
  { id: '#BX-8890-C', product: 'Control Modules (V2)', po: 'PO-2023-840', qty: '850', custodian: 'AeroTech Assembly', custodianInitials: 'AT', status: 'Overdue', statusColor: 'red', time: '12 days overdue' },
  { id: '#BX-8928-A', product: 'Optical Sensors (IR)', po: 'PO-2023-885', qty: '3,000', custodian: 'Global Logistics Hub', custodianInitials: 'GL', status: 'Flagged Hold', statusColor: 'amber', time: 'Pending Review' }
];

export default function BatchList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Statuses');

  // Filter Logic
  const filteredBatches = useMemo(() => {
    return MOCK_BATCHES.filter(batch => {
      const matchesSearch = batch.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            batch.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            batch.po.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'All Statuses') return matchesSearch;
      if (activeFilter === 'Payment Verified' && batch.status === 'Payment Verified') return matchesSearch;
      if (activeFilter === 'Custody Confirmed' && batch.status === 'Custody Confirmed') return matchesSearch;
      if (activeFilter === 'Overdue' && batch.status === 'Overdue') return matchesSearch;
      return false;
    });
  }, [searchQuery, activeFilter]);

  const handleExport = () => {
    alert("Exporting report as CSV...");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-[48px] w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary tracking-tight">Production Batches</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Comprehensive list of all manifested production runs. Track custody transfers and settlement status across the supply chain network.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-surface border border-outline text-primary font-body-sm text-body-sm px-4 py-2 rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <Link href="/manufacturer/batches/create" className="bg-primary text-on-primary font-body-sm text-body-sm px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Manifest
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-gutter mb-8 shadow-[0_4px_12px_rgba(33,49,69,0.02)]">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded focus:border-secondary focus:border-2 focus:ring-0 font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant transition-all outline-none" 
              placeholder="Search Batch ID, Product..." 
              type="text" 
            />
          </div>
          <div className="w-px h-8 bg-outline-variant hidden md:block mx-2"></div>
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All Statuses', 'Payment Verified', 'Custody Confirmed', 'Overdue'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors flex items-center gap-1 ${
                  activeFilter === filter 
                    ? 'border-secondary bg-inverse-on-surface text-secondary font-semibold' 
                    : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(33,49,69,0.02)]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-outline-variant">
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Batch ID</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Product & Description</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant text-right whitespace-nowrap">Quantity</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Current Custodian</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap text-right">Settlement Timeline</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredBatches.length > 0 ? filteredBatches.map((batch, idx) => (
                <tr key={idx} className={`hover:bg-[#F8FAFC] transition-colors group ${batch.statusColor === 'red' ? 'bg-red-50/30' : ''} ${batch.statusColor === 'blue' ? 'relative z-10 bg-white shadow-[0_4px_12px_rgba(33,49,69,0.05)] border-l-2 border-l-secondary' : ''}`}>
                  <td className={`py-4 px-4 font-data-mono text-data-mono ${batch.statusColor === 'red' ? 'text-error' : 'text-primary'}`}>{batch.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-body-sm text-body-sm font-medium text-on-surface">{batch.product}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{batch.po}</div>
                  </td>
                  <td className="py-4 px-4 font-data-mono text-data-mono text-on-surface text-right">{batch.qty} units</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-[10px] font-bold">{batch.custodianInitials}</div>
                      <span className="font-body-sm text-body-sm text-on-surface">{batch.custodian}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {batch.statusColor === 'emerald' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border-l-2 border-emerald-500 text-emerald-800 font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600 icon-fill">check_circle</span>
                        {batch.status}
                      </div>
                    )}
                    {batch.statusColor === 'blue' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border-l-2 border-blue-500 text-blue-800 font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-blue-600">local_shipping</span>
                        {batch.status}
                      </div>
                    )}
                    {batch.statusColor === 'surface' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border-l-2 border-outline text-on-surface font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-outline">inventory_2</span>
                        {batch.status}
                      </div>
                    )}
                    {batch.statusColor === 'red' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 border-l-2 border-red-500 text-red-800 font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-red-600">warning</span>
                        {batch.status}
                      </div>
                    )}
                    {batch.statusColor === 'amber' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border-l-2 border-amber-500 text-amber-800 font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[14px] text-amber-600">flag</span>
                        {batch.status}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-body-sm text-body-sm ${batch.statusColor === 'red' ? 'font-bold text-error' : (batch.statusColor === 'blue' ? 'font-medium text-on-surface' : 'text-on-surface-variant')}`}>{batch.time}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {batch.statusColor === 'blue' ? (
                      <Link href={`/manufacturer/batches/${batch.id.replace('#', '')}`} className="bg-secondary text-on-secondary font-body-sm text-body-sm px-3 py-1 rounded hover:opacity-90 transition-opacity inline-block">
                        View
                      </Link>
                    ) : batch.statusColor === 'red' ? (
                      <button className="border border-error text-error font-body-sm text-body-sm px-3 py-1 rounded hover:bg-error-container transition-colors bg-surface">
                        Review
                      </button>
                    ) : (
                      <Link href={`/manufacturer/batches/${batch.id.replace('#', '')}`} className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 inline-block">
                        <span className="material-symbols-outlined">more_vert</span>
                      </Link>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">No batches match your search or filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-gutter py-4 border-t border-outline-variant bg-surface flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {filteredBatches.length > 0 ? 1 : 0} to {filteredBatches.length} of {MOCK_BATCHES.length} batches
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
