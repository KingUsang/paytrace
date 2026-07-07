'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [demoSerial, setDemoSerial] = useState('PT-992-A4X');

  useEffect(() => {
    // Optionally fetch a real serial from the backend for the verify link if needed
    const fetchLatest = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/allocations`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setDemoSerial(data[0].id.split('-')[0]);
        }
      } catch (e) {
        // Fallback to default
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md overflow-x-hidden selection:bg-secondary/30">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/50 transition-all">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-title-md group-hover:scale-105 transition-transform shadow-md">
              PT
            </div>
            <span className="font-headline-sm text-primary tracking-tight">PayTrace</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:bg-[#213145] hover:shadow-lg transition-all font-title-sm font-bold active:scale-95"
            >
              Demo Login
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero */}
      <section className="pt-40 pb-24 px-6 relative max-w-[1280px] mx-auto">
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 mix-blend-multiply" />
        <div className="absolute top-60 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 mix-blend-multiply" />

        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-display-lg text-[56px] md:text-[80px] leading-[1.1] text-primary mb-8 tracking-tight font-black">
            The <span className="text-secondary inline-block transform hover:scale-110 transition-transform cursor-default">₦</span> that proves it's real.
          </h1>
          <p className="font-body-lg text-[20px] md:text-[24px] text-on-surface-variant max-w-3xl mx-auto mb-12 leading-relaxed">
            PayTrace turns Nomba's payment rails into a verified chain of custody — so manufacturers always know who holds their product, and consumers always know if it's genuine.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              href={`/verify/${demoSerial}`} 
              className="px-8 py-4 bg-secondary text-on-secondary rounded-xl font-title-md hover:bg-[#00905e] hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto text-lg"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
              See how it works
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-surface border-2 border-primary text-primary rounded-xl font-title-md hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 w-full sm:w-auto text-lg"
            >
              For manufacturers
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="py-24 bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="font-headline-lg text-[32px] md:text-[48px] text-primary mb-16 text-center max-w-3xl mx-auto leading-tight font-bold">
            Counterfeiting isn't an inconvenience. <br/><span className="text-error">It's a body count.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-error-container/20 border border-error/20 p-8 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-error text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>healing</span>
              <p className="font-body-lg text-on-surface text-lg leading-relaxed">Fake antimalarials kill an estimated <strong className="text-error">12,300 people</strong> a year in Nigeria.</p>
            </div>
            <div className="bg-error-container/20 border border-error/20 p-8 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-error text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p className="font-body-lg text-on-surface text-lg leading-relaxed">NAFDAC found <strong className="text-error">30% of drugs</strong> in open markets were fake or substandard in 2025.</p>
            </div>
            <div className="bg-error-container/20 border border-error/20 p-8 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined text-error text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
              <p className="font-body-lg text-on-surface text-lg leading-relaxed">Nigeria's broader counterfeit economy costs an estimated <strong className="text-error">₦15 trillion</strong> a year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Insight */}
      <section className="py-32 px-6 max-w-[1280px] mx-auto text-center relative">
        <div className="absolute inset-0 flex justify-center items-center -z-10 opacity-5">
          <span className="material-symbols-outlined text-[400px]">lightbulb</span>
        </div>
        <h2 className="font-display-md text-[40px] md:text-[56px] text-primary mb-8 font-black tracking-tight">
          Money already tells the truth. <br/> We just make it provable.
        </h2>
        <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant max-w-4xl mx-auto leading-relaxed">
          Every legitimate handover of goods can leave behind a real, regulated financial event — not a sticker that can be photocopied, not a database entry anyone could edit. PayTrace makes that event happen automatically, on Nomba's ledger, at every step from factory to shelf. <strong className="text-primary">The result is a chain of custody that's independently auditable, not just internally claimed.</strong>
        </p>
      </section>

      {/* 4. How It Works */}
      <section className="py-24 bg-primary text-on-primary">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="font-headline-lg text-[36px] md:text-[48px] mb-16 text-center font-bold">
            From factory to your hand — <br className="hidden md:block"/>every step, verified.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-white/10 -z-0"></div>
            
            {[
              { num: '1', title: 'Manufacturer creates a batch', desc: 'A dedicated Nomba account is provisioned instantly.', icon: 'factory' },
              { num: '2', title: 'Distributor confirms receipt', desc: 'A real payment, or a quick scan and code for credit sales.', icon: 'local_shipping' },
              { num: '3', title: 'Every handover is recorded', desc: 'A transaction on Nomba\'s regulated ledger, not just a database.', icon: 'receipt_long' },
              { num: '4', title: 'Consumer scans product', desc: 'Sees the full verified chain, and gets rewarded for checking.', icon: 'qr_code_scanner' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-4xl mb-6 shadow-xl relative group">
                  <div className="absolute -inset-2 bg-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-primary">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-title-lg text-2xl font-bold mb-3">{step.title}</h3>
                <p className="font-body-md text-white/80 text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Two-Tier Trust System */}
      <section className="py-24 max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-[36px] md:text-[48px] text-primary font-bold mb-4">
            Not all proof is equal.
          </h2>
          <p className="font-body-lg text-xl text-on-surface-variant">We show you exactly which kind you're getting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-surface border-2 border-emerald-500/20 rounded-3xl p-10 relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
              <h3 className="font-title-lg text-2xl text-emerald-700 font-bold tracking-tight">Payment Verified</h3>
            </div>
            <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed">
              A real commercial payment was matched to this exact batch. The strongest possible evidence of physical custody transfer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border-2 border-blue-500/20 rounded-3xl p-10 relative overflow-hidden group hover:border-blue-500/50 transition-colors shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
              <h3 className="font-title-lg text-2xl text-blue-700 font-bold tracking-tight">Custody Confirmed</h3>
            </div>
            <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed">
              No payment yet — this handover was on credit — but a BVN-verified person confirmed receipt, backed by a real transaction on Nomba's rails.
            </p>
          </div>
        </div>
      </section>

      {/* 6 & 7. For Manufacturers & Consumers (Split Section) */}
      <section className="py-24 bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* For Manufacturers */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex px-4 py-2 bg-primary/10 text-primary rounded-full font-label-caps text-sm self-start uppercase tracking-wider font-bold">
              For Manufacturers
            </div>
            <h2 className="font-headline-md text-[36px] text-primary font-bold leading-tight">
              Know who's accountable for every batch. Automatically.
            </h2>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-body-lg text-lg text-on-surface-variant">
                  <strong className="text-primary">Stop counterfeits before they reach the shelf</strong> — every unit carries a verifiable identity no one can clone.
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-body-lg text-lg text-on-surface-variant">
                  <strong className="text-primary">See exactly who's responsible for every batch</strong> — on a regulated ledger, not a phone call.
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-body-lg text-lg text-on-surface-variant">
                  <strong className="text-primary">Resolve "we never received it" disputes with evidence</strong> — not trust.
                </span>
              </li>
            </ul>
            <Link href="/login" className="mt-4 px-8 py-4 bg-primary text-on-primary rounded-xl font-title-md hover:bg-[#213145] transition-all self-start text-lg shadow-md">
              Request early access
            </Link>
          </div>

          {/* For Consumers */}
          <div className="flex flex-col gap-8 bg-surface border border-outline-variant rounded-3xl p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="inline-flex px-4 py-2 bg-secondary/10 text-secondary rounded-full font-label-caps text-sm self-start uppercase tracking-wider font-bold">
              For Consumers
            </div>
            <h2 className="font-headline-md text-[36px] text-primary font-bold leading-tight relative z-10">
              Scan. Know it's real. Get paid for checking.
            </h2>
            
            <div className="flex items-center justify-between my-8 relative z-10 max-w-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center text-3xl shadow-sm border border-outline-variant">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                </div>
                <span className="font-title-sm font-bold text-primary">Scan</span>
              </div>
              <div className="h-1 flex-1 bg-outline-variant/50 mx-4 relative">
                <div className="absolute inset-y-0 left-0 bg-secondary w-1/2"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center text-3xl shadow-sm border border-outline-variant">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <span className="font-title-sm font-bold text-primary">Verify</span>
              </div>
              <div className="h-1 flex-1 bg-outline-variant/50 mx-4"></div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-3xl shadow-md">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <span className="font-title-sm font-bold text-secondary">Earn</span>
              </div>
            </div>

            <p className="font-body-lg text-xl text-on-surface-variant font-medium leading-relaxed relative z-10 border-l-4 border-secondary pl-6 py-2 bg-secondary/5 rounded-r-lg">
              Every genuine check earns you a reward — and catching a fake earns you more.
            </p>
          </div>

        </div>
      </section>

      {/* 8. Built on Nomba */}
      <section className="py-24 max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="font-headline-lg text-[32px] md:text-[40px] text-primary font-bold mb-16">
          Every part of this runs on Nomba.
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {['Virtual Accounts', 'Webhooks', 'Transactions API', 'Disbursements'].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
              <div className="w-20 h-20 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all group-hover:-translate-y-2">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {i===0 ? 'account_balance' : i===1 ? 'webhook' : i===2 ? 'swap_horiz' : 'payments'}
                </span>
              </div>
              <span className="font-title-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">{item}</span>
            </div>
          ))}
        </div>

        <p className="font-body-lg text-xl text-on-surface-variant max-w-3xl mx-auto italic">
          "Remove Nomba, and this entire chain disappears. It's not decoration — it's the backbone."
        </p>
      </section>

      {/* 9. Why We're Building This */}
      <section className="py-24 bg-surface-container-low border-t border-outline-variant/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-surface border border-outline-variant p-10 md:p-16 rounded-3xl shadow-xl relative">
            <span className="material-symbols-outlined text-[120px] text-surface-container-highest absolute top-4 left-4 -z-0" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="font-title-lg text-sm uppercase tracking-widest text-on-surface-variant mb-8 font-bold">Why We're Building This</h2>
              <p className="font-display-sm text-[24px] md:text-[32px] text-primary leading-relaxed font-medium mb-8">
                I'm building PayTrace because counterfeiting in Nigeria isn't a distant statistic — it's a solvable infrastructure problem, hiding in plain sight inside payment rails that already exist.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary font-title-sm font-bold">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                DevCareer x Nomba Hackathon 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final CTA / Footer */}
      <footer className="bg-primary text-on-primary pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-display-lg text-[48px] md:text-[64px] font-black tracking-tight mb-10">
            The <span className="text-secondary">₦</span> that proves it's real.
          </h2>
          <button className="px-10 py-5 bg-secondary text-on-secondary rounded-xl font-title-lg hover:bg-white hover:text-primary transition-all text-xl shadow-xl mb-32 hover:-translate-y-1">
            Get in touch
          </button>

          <div className="w-full border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white font-bold text-sm border border-white/20">PT</div>
              <span className="font-title-md text-white/90">PayTrace</span>
            </div>
            <div className="flex gap-8 text-white/70 font-title-sm">
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">X/Twitter</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
