'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DemoLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = async (role: 'manufacturer' | 'distributor') => {
    setIsLoading(role);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error('Login Failed Response:', res.status, errText);
        throw new Error(`Failed to login: ${res.status} ${errText}`);
      }
      const data = await res.json();
      localStorage.setItem('paytrace_token', data.token);
      localStorage.setItem('paytrace_role', data.user.role);
      
      if (role === 'manufacturer') {
        router.push('/manufacturer/dashboard');
      } else {
        router.push('/distributor/inventory');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to login');
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex-1 bg-surface-container-lowest flex items-center justify-center p-4 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-title-md">
              PT
            </div>
            <span className="font-headline-sm text-primary tracking-tight">PayTrace</span>
          </Link>
          <h1 className="font-headline-md text-primary tracking-tight mb-2">Hackathon Demo Access</h1>
          <p className="font-body-md text-on-surface-variant">Select a role to experience the platform.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleLogin('manufacturer')}
            disabled={isLoading !== null}
            className={`bg-surface border border-outline-variant rounded-xl p-6 text-left hover:shadow-[0_8px_24px_rgba(33,49,69,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${isLoading ? 'opacity-50' : ''}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>factory</span>
              </div>
              <div className="flex-1">
                <h2 className="font-title-lg text-primary mb-1">Manufacturer</h2>
                <p className="font-body-sm text-on-surface-variant">Global dashboard, batch creation, and aggregate settlements.</p>
              </div>
              {isLoading === 'manufacturer' && <span className="material-symbols-outlined animate-spin text-primary">sync</span>}
              {isLoading !== 'manufacturer' && <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>}
            </div>
          </button>

          <button 
            onClick={() => handleLogin('distributor')}
            disabled={isLoading !== null}
            className={`bg-surface border border-outline-variant rounded-xl p-6 text-left hover:shadow-[0_8px_24px_rgba(33,49,69,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${isLoading ? 'opacity-50' : ''}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <div className="flex-1">
                <h2 className="font-title-lg text-primary mb-1">Distributor</h2>
                <p className="font-body-sm text-on-surface-variant">Inventory tracking, receiving goods, and forwarding allocations.</p>
              </div>
              {isLoading === 'distributor' && <span className="material-symbols-outlined animate-spin text-secondary">sync</span>}
              {isLoading !== 'distributor' && <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">arrow_forward</span>}
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
