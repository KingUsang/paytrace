'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateBatch() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('50');
  const [paymentTerm, setPaymentTerm] = useState<'cash' | 'credit'>('cash');
  const [termDays, setTermDays] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          quantity: quantity,
          unit_price: unitPrice,
          declared_terms: paymentTerm.toUpperCase(),
          credit_term_days: paymentTerm === 'credit' ? termDays : null
        })
      });
      
      if (!res.ok) throw new Error('Failed to create batch');
      
      router.push('/manufacturer/batches');
    } catch (error) {
      console.error(error);
      alert('Error creating batch');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow md:pt-0 bg-surface min-h-screen pb-24 md:pb-margin-desktop w-full">
      {/* Header */}
      <div className="max-w-container-max-width mx-auto mb-8 p-margin-mobile md:p-margin-desktop pb-0 md:pb-0">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/manufacturer/dashboard">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="font-body-sm text-body-sm">Back to Batches</span>
          </Link>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Create Production Batch</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">Provision a new tracking batch and generate associated payment terminals for downstream custody transfer.</p>
      </div>

      <form onSubmit={handleProvision} className="max-w-container-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop">
        {/* Form Area (Left side) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Batch Details */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
            <div className="bg-surface p-4 md:p-6 border-b border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">qr_code_scanner</span>
              <h2 className="font-title-md text-title-md text-primary">Batch Identification</h2>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              {/* Auto-generated ID */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Batch ID (Auto-Generated)</label>
                <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg p-3">
                  <span className="font-data-mono text-data-mono text-primary flex-grow tracking-widest">BCH-20231024-88A9</span>
                  <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-secondary-container" title="Copy to clipboard">content_copy</span>
                </div>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="productSelect">Product Line <span className="text-error">*</span></label>
                  <div className="relative">
                    <input 
                      required 
                      value={productName} 
                      onChange={(e) => setProductName(e.target.value)} 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors" 
                      id="productSelect" 
                      placeholder="e.g., Industrial Grade Silicon" 
                      type="text" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="quantity">Unit Quantity <span className="text-error">*</span></label>
                  <div className="relative">
                    <input required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-data-mono text-data-mono text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors pr-12" id="quantity" placeholder="0" type="number" />
                    <span className="absolute right-4 top-3 text-on-surface-variant font-label-caps text-label-caps">UNITS</span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="unitPrice">Unit Price (₦) <span className="text-error">*</span></label>
                  <div className="relative">
                    <input required value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-data-mono text-data-mono text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors" id="unitPrice" placeholder="50" step="0.01" min="0" type="number" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Terms */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
            <div className="bg-surface p-4 md:p-6 border-b border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">account_balance</span>
              <h2 className="font-title-md text-title-md text-primary">Financial Provisioning</h2>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3">Settlement Terms</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Cash Option */}
                  <label className={`flex-1 relative border rounded-lg p-4 cursor-pointer hover:bg-surface-container-low transition-colors group ${paymentTerm === 'cash' ? 'border-secondary bg-inverse-on-surface' : 'border-outline-variant'}`}>
                    <input checked={paymentTerm === 'cash'} onChange={() => setPaymentTerm('cash')} className="absolute right-4 top-4 text-secondary focus:ring-secondary w-5 h-5 accent-secondary" name="paymentTerms" type="radio" value="cash" />
                    <div className="flex flex-col">
                      <span className={`material-symbols-outlined mb-2 ${paymentTerm === 'cash' ? 'text-secondary' : 'text-on-surface-variant'}`}>payments</span>
                      <span className="font-title-md text-title-md text-primary">Immediate / Cash</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Settlement required upon custody transfer.</span>
                    </div>
                  </label>

                  {/* Credit Option */}
                  <label className={`flex-1 relative border rounded-lg p-4 cursor-pointer hover:bg-surface-container-low transition-colors group ${paymentTerm === 'credit' ? 'border-secondary bg-inverse-on-surface' : 'border-outline-variant'}`}>
                    <input checked={paymentTerm === 'credit'} onChange={() => setPaymentTerm('credit')} className="absolute right-4 top-4 text-secondary focus:ring-secondary w-5 h-5 accent-secondary" name="paymentTerms" type="radio" value="credit" />
                    <div className="flex flex-col">
                      <span className={`material-symbols-outlined mb-2 ${paymentTerm === 'credit' ? 'text-secondary' : 'text-on-surface-variant'}`}>schedule</span>
                      <span className="font-title-md text-title-md text-primary">Credit Terms</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Deferred settlement with defined maturity.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Term Length Field (Conditional) */}
              {paymentTerm === 'credit' && (
                <div className="pt-4 border-t border-outline-variant" id="termLengthContainer">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="termLength">Term Length (Days) <span className="text-error">*</span></label>
                  <div className="relative w-full md:w-1/2">
                    <select value={termDays} onChange={(e) => setTermDays(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors appearance-none cursor-pointer" id="termLength">
                      <option value="15">Net 15</option>
                      <option value="30">Net 30</option>
                      <option value="60">Net 60</option>
                      <option value="90">Net 90</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary / Action Panel (Right side) */}
        <div className="lg:col-span-4">
          <div className="bg-primary border border-primary-container rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(15,23,42,0.1)] sticky top-24">
            <div className="p-6">
              <h3 className="font-title-md text-title-md text-on-primary mb-4">Provisioning Summary</h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center border-b border-primary-container pb-2">
                  <span className="font-body-sm text-body-sm text-primary-fixed-dim">Status</span>
                  <span className="font-label-caps text-label-caps bg-surface-tint text-on-primary px-2 py-1 rounded">DRAFT</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="font-body-sm text-body-sm text-primary-fixed-dim">Est. Value Base</span>
                  <span className="font-data-mono text-data-mono text-on-primary">
                    {quantity && unitPrice ? `₦${(Number(quantity) * Number(unitPrice)).toLocaleString()}` : 'TBD'}
                  </span>
                </div>
              </div>

              <div className="bg-surface-tint/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm mt-0.5">info</span>
                  <p className="font-body-sm text-body-sm text-primary-fixed">Creating this batch will provision a unique virtual account and generate the cryptographic QR asset for physical tracking.</p>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">{isSubmitting ? 'sync' : 'qr_code_2'}</span>
                {isSubmitting ? 'Provisioning...' : 'Provision & Generate QR'}
              </button>
              
              <button type="button" className="w-full mt-3 border border-outline text-on-primary hover:bg-surface-tint/30 font-bold py-3 px-4 rounded-lg transition-colors">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
