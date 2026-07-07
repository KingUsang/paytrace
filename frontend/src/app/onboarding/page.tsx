'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bvn, setBvn] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const totalSteps = 3;

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (currentStep === 1) {
      if (bvn.length !== 11) return; // Basic validation
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false);
        router.push('/distributor/inventory');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop w-full overflow-hidden">
      <main className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_12px_24px_rgba(15,23,42,0.1)] overflow-hidden flex flex-col">
        
        {/* Header / Progress */}
        <header className="bg-surface-container-low p-gutter border-b border-outline-variant">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Distributor Setup</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Complete these 3 steps to activate your secure ledger.</p>
          
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-outline-variant rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary rounded-full z-0 transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
            
            {/* Steps */}
            {[1, 2, 3].map((step) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;
              
              let circleClass = "w-8 h-8 rounded-full border-2 text-sm flex items-center justify-center font-bold z-10 transition-colors duration-300 ";
              if (isPast || isActive) {
                circleClass += "bg-secondary text-on-secondary border-secondary shadow-md";
              } else {
                circleClass += "bg-surface-container-lowest border-outline-variant text-on-surface-variant";
              }

              const labelNames = ["Identity", "Account", "Activate"];

              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-1">
                  <div className={circleClass}>
                    {isPast ? <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>check</span> : step}
                  </div>
                  <span className={`font-label-caps text-label-caps transition-colors ${isActive || isPast ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {labelNames[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </header>

        {/* Step Content Area */}
        <div className="p-gutter min-h-[320px] relative overflow-hidden bg-surface-container-lowest">
          
          {/* Step 1: BVN Entry */}
          <section 
            className={`absolute inset-0 p-gutter transition-transform duration-500 transform ${currentStep === 1 ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>fingerprint</span>
              <div>
                <h2 className="font-title-md text-title-md text-primary">Identity Verification</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Enter your Bank Verification Number (BVN) to securely link your identity.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="bvn-input">11-Digit BVN</label>
                <input 
                  id="bvn-input" 
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={11}
                  placeholder="00000000000" 
                  type="text"
                  className={`w-full bg-surface p-3 rounded-lg border focus:border-2 focus:outline-none font-data-mono text-data-mono tracking-widest text-primary ${bvn.length > 0 && bvn.length !== 11 ? 'border-error focus:border-error' : 'border-outline-variant focus:border-secondary'}`} 
                />
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Your BVN is encrypted and used solely for regulatory compliance and identity verification.</p>
              </div>
            </div>
          </section>

          {/* Step 2: Auto-provisioning (Nomba) */}
          <section 
            className={`absolute inset-0 p-gutter transition-transform duration-500 transform ${currentStep === 2 ? 'translate-x-0' : currentStep < 2 ? 'translate-x-full' : '-translate-x-full'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
              <div>
                <h2 className="font-title-md text-title-md text-primary">Account Provisioning</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Generating your dedicated sub-account.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="relative">
                {isGenerating ? (
                  <span className="material-symbols-outlined text-secondary text-6xl animate-spin" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>
                ) : (
                  <span className="material-symbols-outlined text-secondary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                )}
              </div>
              <div className="text-center">
                <p className="font-body-md text-body-md text-primary font-medium">{isGenerating ? 'Creating Nomba Sub-Account...' : 'Account Provisioned Successfully!'}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{isGenerating ? 'This usually takes just a few seconds.' : 'Ready to activate.'}</p>
              </div>
            </div>
          </section>

          {/* Step 3: Activation Top-up */}
          <section 
            className={`absolute inset-0 p-gutter transition-transform duration-500 transform ${currentStep === 3 ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>task_alt</span>
              <div>
                <h2 className="font-title-md text-title-md text-primary">Activate Ledger</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Initiate a small transfer to activate your account.</p>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-outline-variant mb-4">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Please transfer a minimum of <strong>₦1,000</strong> to your new sub-account to activate ledger tracking.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Bank</span>
                  <span className="font-body-md text-body-md font-medium text-primary">Nomba</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Account Name</span>
                  <span className="font-body-md text-body-md font-medium text-primary">Distributor Ledger - User</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono text-data-mono font-medium text-primary">9087654321</span>
                    <button className="text-secondary hover:bg-surface-container-high p-1 rounded transition-colors" title="Copy">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer / Actions */}
        <footer className="p-gutter bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
          <button 
            onClick={handleBack}
            className={`px-4 py-2 border border-outline text-on-surface-variant font-body-md text-body-md font-medium rounded-lg hover:bg-surface-container-high transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isGenerating || isChecking}
            className={`px-6 py-2 font-body-md text-body-md font-medium rounded-lg transition-colors ml-auto flex items-center gap-2 ${
              isGenerating || (currentStep === 1 && bvn.length !== 11)
                ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed' 
                : 'bg-primary text-on-primary hover:bg-inverse-surface'
            }`}
          >
            {isChecking && <span className="material-symbols-outlined animate-spin text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>}
            {currentStep === 1 ? 'Verify Identity' : currentStep === 2 ? (isGenerating ? 'Generating...' : 'Continue to Activation') : (isChecking ? 'Checking...' : 'I have transferred funds')}
          </button>
        </footer>
      </main>
    </div>
  );
}
