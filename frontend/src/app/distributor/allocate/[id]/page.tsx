'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AllocateBatchPage() {
  const params = useParams();
  const id = params.id as string;
  const [quantity, setQuantity] = useState('');
  const [phone, setPhone] = useState('');
  const [terms, setTerms] = useState<'cash' | 'credit'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimCode, setClaimCode] = useState<string | null>(null);
  const [newAllocationId, setNewAllocationId] = useState<string | null>(null);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const token = localStorage.getItem('paytrace_token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/allocations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setAllocation(data);
      } catch (error) {
        console.error('Failed to fetch allocation', error);
      }
    };
    fetchAllocation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('paytrace_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const res = await fetch(`${API_URL}/api/allocations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          batch_id: id, // For demo, we might need to adjust backend to accept parent_allocation_id
          to_phone_number: phone,
          quantity: quantity,
          declared_terms: terms.toUpperCase(),
          credit_term_days: terms === 'credit' ? 30 : null
        })
      });

      if (!res.ok) throw new Error('Failed to allocate');
      const data = await res.json();
      setClaimCode(data.claim_code);
      setNewAllocationId(data.id);
    } catch (error) {
      console.error(error);
      alert('Error creating allocation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (claimCode) {
    return (
      <div className="flex-1 p-margin-mobile md:p-margin-desktop flex flex-col items-center justify-center relative w-full h-full min-h-[calc(100vh-64px)]">
        <div className="bg-surface border border-outline-variant rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-emerald-500 text-6xl mb-4">check_circle</span>
          <h2 className="font-headline-sm text-primary mb-2">Allocation Successful</h2>
          <p className="text-on-surface-variant mb-6">The sub-account has been provisioned. Share this claim code with the retailer to confirm custody.</p>
          <div className="bg-surface-container-lowest border-2 border-dashed border-secondary rounded-lg p-6 mb-6">
            <span className="font-data-mono text-4xl text-primary tracking-[0.2em]">{claimCode}</span>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={newAllocationId ? `/retailer/verify/${newAllocationId}` : "#"} target="_blank" className="bg-secondary text-on-secondary hover:opacity-90 font-bold py-3 px-6 rounded-lg w-full block transition-opacity">
              Open Retailer Portal (Demo)
            </Link>
            <Link href="/distributor/inventory" className="bg-surface-container-high text-on-surface hover:bg-outline-variant font-bold py-3 px-6 rounded-lg w-full block transition-colors">
              Return to Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop flex flex-col items-center justify-center relative pb-24 md:pb-margin-desktop w-full h-full min-h-[calc(100vh-64px)]">
      
      {/* Abstract background element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-surface-container-high blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-surface-container blur-3xl"></div>
      </div>

      <div className="w-full max-w-[600px] z-10">
        
        {/* Header */}
        <div className="mb-8 relative flex items-center">
          <Link href="/distributor/inventory" className="absolute -left-12 hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </Link>
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 tracking-tight">Forward Goods</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Generate secure claim code and notify recipient.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(30,41,59,0.05)] overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            
            {/* Batch Info (Context) */}
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="w-12 h-12 bg-primary-container text-on-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>inventory_2</span>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Selected Batch</div>
                <div className="font-title-md text-title-md text-primary tracking-tight">{allocation?.batch?.product_name || '...'}</div>
                <div className="font-data-mono text-data-mono text-on-surface-variant mt-1 text-sm">ID: {id}</div>
              </div>
            </div>

            <hr className="border-outline-variant my-2" />

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="font-title-md text-title-md text-primary flex justify-between items-center" htmlFor="quantity">
                Select Quantity
                <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Available: {allocation?.quantity || '...'} units</span>
              </label>
              <div className="relative">
                <input 
                  id="quantity" 
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-data-mono text-data-mono text-primary focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all shadow-sm" 
                  max={allocation?.quantity || 1} min="1" 
                  placeholder="0" required 
                  type="number" 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="font-body-md text-body-md text-on-surface-variant">Units</span>
                </div>
              </div>
            </div>

            {/* Recipient Phone */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-title-md text-title-md text-primary" htmlFor="phone">Recipient's Phone Number</label>
                <button 
                  type="button" 
                  onClick={() => setPhone('+2349000000000')} 
                  className="font-body-sm text-body-sm text-secondary hover:underline cursor-pointer bg-surface-container-low px-2 py-1 rounded"
                >
                  Use Demo Retailer
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>phone</span>
                  </div>
                  <input 
                    id="phone" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 font-data-mono text-data-mono text-primary focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all shadow-sm" 
                    placeholder="+234 800 000 0000" required 
                    type="tel" 
                  />
                </div>
                <button type="button" aria-label="Select from contacts" className="flex-shrink-0 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-primary rounded-lg px-4 py-3 transition-colors flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>contacts</span>
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">An automated SMS with the claim code will be sent here.</p>
            </div>

            {/* Terms Toggle */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="font-title-md text-title-md text-primary">Terms</span>
              <div className="flex p-1 bg-surface-container-low rounded-lg border border-outline-variant relative shadow-sm">
                
                {/* Animated background pill */}
                <div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface border border-outline-variant rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out" 
                  style={{ transform: terms === 'cash' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
                ></div>

                <label className="flex-1 text-center py-2 relative z-10 cursor-pointer group">
                  <input 
                    className="sr-only" 
                    name="terms" 
                    type="radio" 
                    value="cash"
                    checked={terms === 'cash'}
                    onChange={() => setTerms('cash')}
                  />
                  <span className={`font-body-md text-body-md transition-colors ${terms === 'cash' ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    Cash
                  </span>
                </label>

                <label className="flex-1 text-center py-2 relative z-10 cursor-pointer group">
                  <input 
                    className="sr-only" 
                    name="terms" 
                    type="radio" 
                    value="credit"
                    checked={terms === 'credit'}
                    onChange={() => setTerms('credit')}
                  />
                  <span className={`font-body-md text-body-md transition-colors ${terms === 'credit' ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    Credit
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="bg-surface-container-low border-t border-outline-variant p-6 md:p-8">
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-[#213145] text-on-primary font-title-md text-title-md rounded-lg py-4 flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-1 disabled:opacity-50">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{isSubmitting ? 'sync' : 'qr_code_2'}</span>
              {isSubmitting ? 'Generating...' : 'Generate Claim Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
