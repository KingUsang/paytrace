'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RetailerVerifyPage() {
  const params = useParams();
  const id = params.id as string;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    // Fetch allocation details to show context
    const fetchAlloc = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/allocations?id=${id}`);
        const data = await res.json();
        const target = data.find((a: any) => a.id === id);
        if (target) setAllocation(target);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAlloc();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/allocations/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allocation_id: id,
          claim_code: otp
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Invalid OTP');
      }
      
      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-emerald-500 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <h1 className="font-headline-md text-primary mb-2">Custody Confirmed</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          The goods have been successfully transferred to your inventory. A micro-transaction has been processed via Nomba to cryptographically seal this record.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href={`/verify/${id}`} target="_blank" className="bg-secondary text-on-secondary hover:opacity-90 font-bold py-3 px-6 rounded-lg w-full block transition-opacity shadow-md">
            Simulate Consumer Scan
          </Link>
          <Link href="/" className="bg-surface-container-high text-on-surface hover:bg-outline-variant font-bold py-3 px-6 rounded-lg w-full block transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-primary mb-2">Confirm Custody</h1>
          <p className="text-on-surface-variant font-body-md">Enter the 6-digit claim code sent to your phone to accept this inventory transfer.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm mb-6 text-center">
          <div className="font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Allocation ID</div>
          <div className="font-data-mono text-primary font-bold">{id.split('-')[0]}</div>
          {allocation && (
             <div className="mt-4 pt-4 border-t border-outline-variant">
               <div className="font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Product</div>
               <div className="font-body-md text-primary">{allocation.batch?.product_name || 'Industrial Supplies'}</div>
               <div className="font-data-mono text-secondary mt-1">{allocation.quantity} Units</div>
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-label-caps text-on-surface-variant mb-2 text-center">6-Digit Claim Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              className="w-full text-center text-4xl tracking-[0.5em] font-data-mono text-primary bg-surface border-2 border-outline-variant focus:border-secondary focus:ring-0 rounded-lg py-4 transition-colors outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || otp.length < 6}
            className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-1 disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{isSubmitting ? 'sync' : 'verified_user'}</span>
            {isSubmitting ? 'Verifying...' : 'Accept Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
