'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OTPLoginPage() {
  const [otpValue, setOtpValue] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'error' | 'expired'>('idle');
  const router = useRouter();

  const MAX_LENGTH = 6;

  useEffect(() => {
    if (timeRemaining <= 0) {
      setStatus('expired');
      return;
    }
    const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleKeyPress = useCallback((val: string) => {
    if (status === 'expired' || status === 'verifying') return;
    if (otpValue.length < MAX_LENGTH) {
      setOtpValue(prev => prev + val);
      setStatus('idle');
    }
  }, [otpValue, status]);

  const handleBackspace = useCallback(() => {
    if (status === 'expired' || status === 'verifying') return;
    setOtpValue(prev => prev.slice(0, -1));
    setStatus('idle');
  }, [status]);

  const handleClear = useCallback(() => {
    if (status === 'expired' || status === 'verifying') return;
    setOtpValue('');
    setStatus('idle');
  }, [status]);

  const handleSubmit = useCallback(() => {
    if (otpValue.length === MAX_LENGTH && status !== 'expired') {
      setStatus('verifying');
      
      // Simulate verification
      setTimeout(() => {
        if (otpValue === '123456') { // Mock success code
          setStatus('verified');
          setTimeout(() => router.push('/distributor/inventory'), 500);
        } else {
          setStatus('error');
          setOtpValue('');
        }
      }, 1500);
    }
  }, [otpValue, status, router]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleBackspace, handleSubmit]);

  const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
  const seconds = (timeRemaining % 60).toString().padStart(2, '0');
  const percentage = Math.max(0, (timeRemaining / 120) * 100);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop overflow-hidden w-full">
      <main className="w-full max-w-md bg-surface border border-outline-variant rounded-xl shadow-[0_12px_24px_rgba(33,49,69,0.1)] flex flex-col items-center p-gutter relative overflow-hidden">
        
        {/* Progress Bar Background (Expiry) */}
        <div className="absolute top-0 left-0 h-1 w-full bg-surface-container-high">
          <div 
            className={`h-full transition-all duration-1000 ease-linear w-full ${percentage < 25 ? 'bg-error' : 'bg-secondary'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Header */}
        <div className="w-full text-center mt-base mb-gutter pt-4">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">PayTrace Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Enter the 6-digit code sent to your device.</p>
          <p className="text-xs text-outline mt-1">(Use 123456 to test)</p>
        </div>

        {/* OTP Input Display */}
        <div className="flex gap-2 mb-gutter w-full justify-center">
          {Array.from({ length: MAX_LENGTH }).map((_, index) => {
            const char = otpValue[index] || '';
            const isActive = index === otpValue.length;
            const isError = status === 'error';
            
            let borderClass = 'border-outline-variant';
            if (isError) borderClass = 'border-error';
            else if (isActive) borderClass = 'border-secondary shadow-md';

            return (
              <div 
                key={index} 
                className={`w-12 h-14 border-2 rounded flex items-center justify-center font-display-lg text-display-lg text-primary bg-surface-container-lowest transition-colors ${borderClass}`}
              >
                {char}
              </div>
            );
          })}
        </div>

        <div className="font-data-mono text-data-mono text-error mb-gutter h-5 w-full text-center">
          {status === 'error' && "Invalid code. Please try again."}
          {status === 'expired' && "Code expired. Please request a new one."}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-gutter">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={status === 'expired' || status === 'verifying'}
              className="h-16 bg-surface-container border border-outline-variant rounded-lg font-headline-lg text-headline-lg text-primary active:bg-secondary active:text-on-secondary active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleClear}
            disabled={status === 'expired' || status === 'verifying'}
            className="h-16 flex items-center justify-center text-on-surface-variant active:opacity-50 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined font-title-md text-title-md" style={{ fontVariationSettings: "'FILL' 0" }}>cancel</span>
          </button>
          <button 
            onClick={() => handleKeyPress('0')}
            disabled={status === 'expired' || status === 'verifying'}
            className="h-16 bg-surface-container border border-outline-variant rounded-lg font-headline-lg text-headline-lg text-primary active:bg-secondary active:text-on-secondary active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            0
          </button>
          <button 
            onClick={handleBackspace}
            disabled={status === 'expired' || status === 'verifying'}
            className="h-16 flex items-center justify-center text-on-surface-variant active:opacity-50 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined font-title-md text-title-md" style={{ fontVariationSettings: "'FILL' 0" }}>backspace</span>
          </button>
        </div>

        {/* Action */}
        <button 
          onClick={handleSubmit}
          disabled={otpValue.length !== MAX_LENGTH || status === 'expired' || status === 'verifying'}
          className={`w-full h-14 font-title-md text-title-md rounded-lg transition-all flex items-center justify-center gap-2
            ${otpValue.length === MAX_LENGTH && status !== 'expired' && status !== 'verifying' 
              ? 'bg-primary text-on-primary hover:bg-inverse-surface cursor-pointer' 
              : status === 'verified' 
                ? 'bg-secondary text-on-secondary' 
                : 'bg-primary text-on-primary opacity-50 cursor-not-allowed'
            }`}
        >
          {status === 'verifying' ? (
            <><span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span> Verifying</>
          ) : status === 'verified' ? (
            <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Verified</>
          ) : (
            'Verify'
          )}
        </button>

        <div className="mt-4 flex justify-between w-full font-label-caps text-label-caps text-on-surface-variant">
          <span>Code expires in <span>{minutes}:{seconds}</span></span>
          <button className="underline decoration-outline-variant hover:text-secondary transition-colors">Resend Code</button>
        </div>
      </main>
    </div>
  );
}
