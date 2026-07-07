'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('paytrace_token');
    const role = localStorage.getItem('paytrace_role');
    if (!token || role !== 'distributor') {
      router.push('/login');
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('paytrace_token');
    localStorage.removeItem('paytrace_role');
    router.push('/login');
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row w-full">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="font-headline-lg-mobile text-headline-lg-mobile font-black text-primary tracking-tight">PayTrace Field</div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          <span className="material-symbols-outlined text-primary cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
        </div>
      </header>

      {/* Side Navigation (Desktop View for Field Roles) */}
      <nav className="hidden md:flex flex-col gap-2 p-gutter fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant z-40 transition-all duration-200 ease-in-out">
        <div className="mb-8">
          <div className="font-headline-lg text-headline-lg font-bold text-primary mb-2 tracking-tight">PayTrace Field</div>
          <div className="text-body-sm text-on-surface-variant">Distributor Portal</div>
        </div>

        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('claims') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`} href="/distributor/claims">
          <span className={`material-symbols-outlined ${pathname.includes('claims') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('claims') ? "'FILL' 1" : "'FILL' 0" }}>assignment_turned_in</span>
          <span className="font-body-md">Claims</span>
        </Link>
        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('inventory') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`} href="/distributor/inventory">
          <span className={`material-symbols-outlined ${pathname.includes('inventory') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('inventory') ? "'FILL' 1" : "'FILL' 0" }}>inventory</span>
          <span className="font-body-md">Inventory</span>
        </Link>
        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('history') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`} href="/distributor/history">
          <span className={`material-symbols-outlined ${pathname.includes('history') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('history') ? "'FILL' 1" : "'FILL' 0" }}>history</span>
          <span className="font-body-md">History</span>
        </Link>

        <div onClick={handleSignOut} className="mt-auto border-t border-outline-variant pt-4 flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-outline text-error">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </div>
          <div>
            <div className="font-title-md text-title-md text-sm text-error">Sign Out</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">Clear Session</div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-background">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-margin-mobile py-2 bg-surface shadow-[0_-4px_12px_rgba(15,23,42,0.05)] z-50 rounded-t-xl border-t border-outline-variant pb-6">
        <Link className={`flex flex-col items-center justify-center transition-transform scale-95 active:scale-90 ${pathname.includes('claims') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant p-2 rounded-lg'}`} href="/distributor/claims">
          <span className={`material-symbols-outlined ${pathname.includes('claims') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('claims') ? "'FILL' 1" : "'FILL' 0" }}>assignment_turned_in</span>
          <span className="font-label-caps text-label-caps mt-1">Claims</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center transition-transform scale-95 active:scale-90 ${pathname.includes('inventory') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant p-2 rounded-lg'}`} href="/distributor/inventory">
          <span className={`material-symbols-outlined ${pathname.includes('inventory') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('inventory') ? "'FILL' 1" : "'FILL' 0" }}>inventory</span>
          <span className="font-label-caps text-label-caps mt-1">Inventory</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center transition-transform scale-95 active:scale-90 ${pathname.includes('history') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant p-2 rounded-lg'}`} href="/distributor/history">
          <span className={`material-symbols-outlined ${pathname.includes('history') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('history') ? "'FILL' 1" : "'FILL' 0" }}>history</span>
          <span className="font-label-caps text-label-caps mt-1">History</span>
        </Link>
      </nav>
    </div>
  );
}
