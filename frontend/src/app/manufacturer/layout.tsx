'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ManufacturerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  if (isLogin) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <>
      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden bg-surface dark:bg-primary-container text-primary dark:text-primary-fixed font-label-caps text-label-caps fixed bottom-0 w-full z-50 rounded-t-xl border-t border-outline-variant dark:border-outline shadow-md dark:shadow-none flex justify-around items-center px-margin-mobile py-2">
        <Link className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform scale-95 active:scale-90 ${pathname.includes('dashboard') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-highest'}`} href="/manufacturer/dashboard">
          <span className={`material-symbols-outlined mb-1 ${pathname.includes('dashboard') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform scale-95 active:scale-90 ${pathname.includes('batches') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-highest'}`} href="/manufacturer/batches">
          <span className={`material-symbols-outlined mb-1 ${pathname.includes('batches') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('batches') ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
          <span>Batches</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform scale-95 active:scale-90 ${pathname.includes('receivables') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-highest'}`} href="/manufacturer/receivables">
          <span className={`material-symbols-outlined mb-1 ${pathname.includes('receivables') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('receivables') ? "'FILL' 1" : "'FILL' 0" }}>payments</span>
          <span>Receivables</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform scale-95 active:scale-90 ${pathname.includes('settings') ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-1' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-highest'}`} href="/manufacturer/settings">
          <span className={`material-symbols-outlined mb-1 ${pathname.includes('settings') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('settings') ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col bg-surface-container-low dark:bg-primary-container text-primary dark:text-primary-fixed font-body-md text-body-md fixed left-0 top-0 h-full w-64 border-r border-outline-variant dark:border-outline flat no-shadows flex-col gap-2 p-gutter z-40 transition-all duration-200 ease-in-out">
        <div className="mb-8">
          <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-primary-fixed mb-1">Manufacturer Portal</div>
          <div className="text-on-surface-variant text-sm">Enterprise Security</div>
        </div>
        
        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('dashboard') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-high dark:hover:bg-inverse-surface'}`} href="/manufacturer/dashboard">
          <span className={`material-symbols-outlined ${pathname.includes('dashboard') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span>Dashboard</span>
        </Link>

        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('batches') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-high dark:hover:bg-inverse-surface'}`} href="/manufacturer/batches">
          <span className={`material-symbols-outlined ${pathname.includes('batches') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('batches') ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
          <span>Batch List</span>
        </Link>

        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('receivables') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-high dark:hover:bg-inverse-surface'}`} href="/manufacturer/receivables">
          <span className={`material-symbols-outlined ${pathname.includes('receivables') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('receivables') ? "'FILL' 1" : "'FILL' 0" }}>payments</span>
          <span>Receivables</span>
        </Link>

        <Link className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${pathname.includes('settings') ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-high dark:hover:bg-inverse-surface'}`} href="/manufacturer/settings">
          <span className={`material-symbols-outlined ${pathname.includes('settings') ? 'icon-fill' : ''}`} style={{ fontVariationSettings: pathname.includes('settings') ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          <span>Settings</span>
        </Link>

        <div className="mt-auto pt-4 border-t border-outline-variant/30 flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-cover bg-center border border-outline" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQLnfu_AxUsqaXPG8NnGriWx_jzpRYgLjs8atSLXX3ltMZI0JpTaaxJ4_p6-d87_QXv_32m7gv0Fp_Qyg9mqjG5wYS6b2-knH1hp0BcnZe5ETAGztvlwAIEJl7yVkOSxyV5kRFC7tTJ6rMFH9QLsf1xBols_HjfzW5OT5XOJQfIb6FeZ6LVhBVPnFQGu-M59gNR2M5kY-7jcn9_5uG0gPh3nu9HO81CGa5vGhrJI4Nqdl3jPcgFazC8uBtzSLto6JQWhwCr6oM4C0')" }}></div>
          <div>
            <div className="font-bold text-sm text-primary">Manufacturer Profile</div>
            <div className="text-xs text-on-surface-variant">Admin Access</div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0 bg-background">
        {/* TopAppBar */}
        <header className="bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed font-title-md text-title-md docked full-width top-0 z-50 border-b border-outline-variant dark:border-outline flat no-shadows flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 bg-opacity-95 backdrop-blur-sm">
          <div className="font-headline-lg text-headline-lg font-black text-primary dark:text-primary-fixed tracking-tight">
            PayTrace
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
              <input className="bg-transparent border-none text-sm focus:ring-0 p-0 text-on-surface-variant placeholder:text-on-surface-variant/50 w-48 focus:outline-none" placeholder="Search batches, IDs..." type="text" />
            </div>
            <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </button>
          </div>
        </header>

        {children}
      </main>
    </>
  );
}
