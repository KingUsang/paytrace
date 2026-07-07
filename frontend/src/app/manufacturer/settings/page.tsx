'use client';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop pb-24 md:pb-margin-desktop max-w-container-max-width mx-auto w-full">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary mb-2">Settings</h1>
          <p className="text-on-surface-variant font-body-md text-body-md">Configure enterprise integrations, team access, and operational limits.</p>
        </div>
        <button className="hidden md:flex bg-primary text-on-primary px-6 py-2 rounded hover:bg-inverse-surface transition-colors items-center gap-2 font-data-mono text-data-mono">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>save</span>
          Save All Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* Webhook Configuration */}
        <section className="bg-white/90 backdrop-blur-sm border border-outline-variant rounded-lg p-6 lg:col-span-2 flex flex-col shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>webhook</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary">Webhook Configuration</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Manage endpoints for payment and custody notifications.</p>
            </div>
            <div className="ml-auto">
              <span className="bg-surface-container-low text-primary px-3 py-1 rounded-full text-xs font-label-caps flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
              </span>
            </div>
          </div>
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">Primary Endpoint URL</label>
              <input className="w-full bg-surface border border-outline-variant rounded px-4 py-2 font-data-mono text-data-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all" type="url" defaultValue="https://api.manufacturer.com/v1/webhooks/paytrace" />
            </div>
            <div>
              <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">Secret Key (Signature Verification)</label>
              <div className="flex gap-2">
                <input className="flex-1 bg-surface border border-outline-variant rounded px-4 py-2 font-data-mono text-data-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all" readOnly type="password" value="whsec_1a2b3c4d5e6f7g8h9i0j" />
                <button className="px-4 py-2 border border-outline-variant rounded text-primary hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                </button>
              </div>
            </div>
            <div className="pt-4">
              <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Subscribed Events</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded cursor-pointer hover:bg-surface-container-high transition-colors">
                  <input defaultChecked className="form-checkbox text-secondary rounded" type="checkbox" />
                  <span className="font-data-mono text-data-mono text-xs text-primary">payment.verified</span>
                </label>
                <label className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded cursor-pointer hover:bg-surface-container-high transition-colors">
                  <input defaultChecked className="form-checkbox text-secondary rounded" type="checkbox" />
                  <span className="font-data-mono text-data-mono text-xs text-primary">custody.confirmed</span>
                </label>
                <label className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded cursor-pointer hover:bg-surface-container-high transition-colors">
                  <input className="form-checkbox text-secondary rounded" type="checkbox" />
                  <span className="font-data-mono text-data-mono text-xs text-primary">batch.failed</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* API Keys */}
        <section className="bg-white/90 backdrop-blur-sm border border-outline-variant rounded-lg p-6 flex flex-col shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>key</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary">API Keys</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Authentication tokens for REST access.</p>
            </div>
          </div>
          <div className="space-y-4 flex-grow">
            <div className="border border-outline-variant rounded p-4 bg-surface-container-lowest">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-data-mono text-data-mono text-primary font-bold">Production Key</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Created: Oct 12, 2023</p>
                </div>
                <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="flex gap-2 mt-4">
                <input className="flex-1 bg-surface border border-outline-variant rounded px-3 py-1.5 font-data-mono text-data-mono text-sm focus:outline-none" readOnly type="password" value="sk_live_1234567890abcdef" />
              </div>
            </div>
            <div className="border border-outline-variant rounded p-4 bg-surface-container-lowest opacity-70">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-data-mono text-data-mono text-primary font-bold">Test Key</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Created: Sep 01, 2023</p>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>experiment</span>
              </div>
              <div className="flex gap-2 mt-4">
                <input className="flex-1 bg-surface border border-outline-variant rounded px-3 py-1.5 font-data-mono text-data-mono text-sm focus:outline-none" readOnly type="password" value="sk_test_abcdef1234567890" />
              </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-surface-container-high text-primary font-data-mono text-data-mono px-4 py-2 rounded hover:bg-surface-variant transition-colors border border-outline-variant">
            Generate New Key
          </button>
        </section>

        {/* Reward Budget */}
        <section className="bg-white/90 backdrop-blur-sm border border-outline-variant rounded-lg p-6 flex flex-col shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance_wallet</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary">Reward Budget</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Incentive limits.</p>
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="font-display-lg text-display-lg text-primary">$50,000</div>
              <div className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider mt-1">Monthly Limit</div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-data-mono text-data-mono text-on-surface-variant mb-1">
                  <span>Utilized</span>
                  <span>$32,450 (65%)</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">Max Payout per Consumer</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-on-surface-variant">$</span>
                  <input className="w-full bg-surface border border-outline-variant rounded pl-8 pr-4 py-2 font-data-mono text-data-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all" type="number" defaultValue="500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="bg-white/90 backdrop-blur-sm border border-outline-variant rounded-lg p-6 lg:col-span-2 flex flex-col shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>group</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary">Team Access</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Manage roles and permissions.</p>
            </div>
            <button className="ml-auto bg-primary text-on-primary px-4 py-2 rounded hover:bg-inverse-surface transition-colors font-data-mono text-data-mono text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>person_add</span>
              Invite
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-3 font-data-mono text-data-mono text-xs text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="p-3 font-data-mono text-data-mono text-xs text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="p-3 font-data-mono text-data-mono text-xs text-on-surface-variant uppercase tracking-wider">Last Active</th>
                  <th className="p-3 font-data-mono text-data-mono text-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">JD</div>
                    <div>
                      <div className="font-body-md text-primary font-semibold">Jane Doe</div>
                      <div className="text-xs text-on-surface-variant">jane.doe@manufacturer.com</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-surface-container text-primary px-2 py-1 rounded text-xs font-data-mono">Admin</span>
                  </td>
                  <td className="p-3 text-sm text-on-surface-variant font-data-mono">Today, 10:42 AM</td>
                  <td className="p-3 text-right">
                    <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span></button>
                  </td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">MS</div>
                    <div>
                      <div className="font-body-md text-primary font-semibold">Mark Smith</div>
                      <div className="text-xs text-on-surface-variant">mark.s@manufacturer.com</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-surface-container text-primary px-2 py-1 rounded text-xs font-data-mono">Operator</span>
                  </td>
                  <td className="p-3 text-sm text-on-surface-variant font-data-mono">Yesterday, 4:15 PM</td>
                  <td className="p-3 text-right">
                    <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
