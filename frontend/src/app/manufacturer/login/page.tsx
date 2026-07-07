'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManufacturerLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both your Merchant ID and Security Credential.');
      return;
    }

    setIsAuthenticating(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsAuthenticating(false);
      // Route to dashboard on success
      router.push('/manufacturer/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-surface text-on-surface h-screen w-full flex flex-col md:flex-row font-body-md overflow-hidden">
      {/* Top Navigation (Hidden on desktop, shown on mobile as a simple header) */}
      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile py-4 border-b border-outline-variant bg-surface z-50">
        <div className="font-headline-lg-mobile text-headline-lg-mobile font-black text-primary">PayTrace</div>
        <div className="flex gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined cursor-pointer">help_outline</span>
        </div>
      </header>

      {/* Left Pane - Branding & Context */}
      <div className="hidden md:flex flex-col justify-between w-5/12 bg-primary-container p-margin-desktop text-on-primary-container border-r border-outline-variant relative h-full">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
        
        <div className="relative z-10">
          <div className="font-headline-lg text-headline-lg font-black text-on-primary mb-12 tracking-tight">PayTrace</div>
          <h1 className="font-display-lg text-display-lg text-on-primary mb-6">Manufacturer<br/>Portal</h1>
          <p className="font-body-md text-body-md text-on-primary-container max-w-sm">
            Secure access to your enterprise financial logistics, batch processing, and receivables management.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 bg-surface/5 p-4 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary-fixed">shield</span>
            <div>
              <h3 className="font-title-md text-title-md text-on-primary">Enterprise Security</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container">Protected by PayTrace Infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-surface/5 p-4 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary-fixed">gpp_good</span>
            <div>
              <h3 className="font-title-md text-title-md text-on-primary">End-to-End Encryption</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container">Bank-grade data protection</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-4 text-on-primary-container mt-12">
          <a className="font-label-caps text-label-caps hover:text-on-primary transition-colors" href="#">Privacy Policy</a>
          <span className="text-outline-variant">•</span>
          <a className="font-label-caps text-label-caps hover:text-on-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </div>

      {/* Right Pane - Authentication */}
      <div className="flex-1 h-full flex flex-col justify-center items-center p-4 md:p-8 relative">
        {/* Subtle background image for the right pane */}
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBuQuoEAn0gycsxzF3QWAZqCIr3tm0IEFwJrykOD4N6KKqxHQ4NDaswF2PPUujS--KnTLNWPhlRgdCtxehRHGiysobTGgBdvTpjVs68DfHuIuHdHqS4gkOoHLUPKgg4FroXXBOoN8TajxZvAvt84zAIvfF3AiZ6dDRxnpP3fuKs7HHI43LrVchfyF6piQF3YcAGv5-lib9N8ehNlZ9mB7EFcJQYyprTR8nIKGqZpS_MVrzNZ7Th3H_NXhQHAanKtUgU9Av7sgrk0g')" }}></div>
        
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="bg-white/95 backdrop-blur-[10px] border border-outline-variant shadow-[0_4px_12px_rgba(11,28,48,0.05)] p-gutter rounded-xl">
            <div className="mb-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Sign In</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Authenticate to access your secure workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 rounded bg-error-container text-on-error-container font-body-sm text-body-sm border border-error/20 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              {/* ID Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="merchant-id">Merchant ID / Email</label>
                <div className="flex items-center border border-outline-variant rounded-lg bg-surface px-4 py-3 transition-all duration-200 focus-within:border-secondary focus-within:border-2">
                  <span className="material-symbols-outlined text-outline mr-3">badge</span>
                  <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-data-mono text-data-mono text-on-surface placeholder-outline-variant outline-none" 
                    id="merchant-id" 
                    placeholder="Enter ID or Email" 
                    type="text"
                    disabled={isAuthenticating}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="password">Security Credential</label>
                <div className="flex items-center border border-outline-variant rounded-lg bg-surface px-4 py-3 transition-all duration-200 focus-within:border-secondary focus-within:border-2">
                  <span className="material-symbols-outlined text-outline mr-3">lock</span>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-data-mono text-data-mono text-on-surface placeholder-outline-variant outline-none" 
                    id="password" 
                    placeholder="••••••••••••" 
                    type={showPassword ? "text" : "password"}
                    disabled={isAuthenticating}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-outline hover:text-on-surface transition-colors ml-2" 
                    type="button"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a className="font-body-sm text-body-sm text-secondary hover:underline" href="#">Forgot Credential?</a>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={isAuthenticating}
                className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-lg hover:bg-inverse-surface transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
              >
                {isAuthenticating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
