'use client';
import React, { useState } from 'react';

const MOCK_INCOMING = [
  {
    id: 'BT-9948-2X',
    sender: 'Global Logistics Inc.',
    product: 'Industrial Motors',
    qty: '450 Units',
    terms: 'Net 30 Credit',
    color: 'bg-secondary'
  },
  {
    id: 'BT-4412-8Y',
    sender: 'Apex Supply Co.',
    product: 'Steel Brackets',
    qty: '1,200 Units',
    terms: 'Cash on Delivery',
    color: 'bg-tertiary-fixed-dim'
  },
  {
    id: 'BT-1109-1Z',
    sender: 'NeoTech Parts',
    product: 'Circuit Boards',
    qty: '850 Units',
    terms: 'Net 60 Credit',
    color: 'bg-secondary'
  }
];

export default function IncomingClaims() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBatches = MOCK_INCOMING.filter(batch => 
    batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-6 pb-24 md:pb-8 px-margin-mobile md:px-gutter max-w-container-max-width mx-auto w-full">
      {/* Header & Search */}
      <section className="mb-8">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-4 tracking-tight">Incoming Batches</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all font-body-md text-body-md shadow-sm" 
              placeholder="Search batch ID, sender, or product..." 
              type="text" 
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-outline-variant rounded-lg bg-surface text-on-surface hover:bg-surface-container-low transition-colors whitespace-nowrap shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            <span className="font-label-caps text-label-caps">Filter</span>
          </button>
        </div>
      </section>

      {/* Batch Cards List */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBatches.length > 0 ? filteredBatches.map((batch) => (
          <article key={batch.id} className="bg-surface border border-outline-variant rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${batch.color}`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Batch ID</p>
                <p className="font-data-mono text-data-mono text-on-surface font-bold text-lg">{batch.id}</p>
              </div>
              <span className="px-3 py-1 bg-surface-container-high text-on-surface rounded-full font-label-caps text-label-caps flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>pending_actions</span>
                Pending
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Sender</p>
                <p className="font-body-md text-body-md text-on-surface font-semibold">{batch.sender}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Product</p>
                <p className="font-body-md text-body-md text-on-surface font-semibold">{batch.product}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Quantity</p>
                <p className="font-data-mono text-data-mono text-on-surface">{batch.qty}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Terms</p>
                <p className="font-body-md text-body-md text-on-surface font-semibold">{batch.terms}</p>
              </div>
            </div>

            <Link href={`/distributor/receive/${batch.id}`} className="w-full bg-secondary hover:bg-secondary-container text-on-secondary py-3 rounded-lg font-title-md text-title-md transition-colors flex items-center justify-center gap-2 font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>call_received</span>
              Receive Batch
            </Link>
          </article>
        )) : (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface border border-outline-variant rounded-lg border-dashed">
            No incoming batches match your search.
          </div>
        )}
      </section>
    </div>
  );
}
