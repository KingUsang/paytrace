import React from 'react';
import Link from 'next/link';

export default function ManufacturerDashboard() {
  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max-width mx-auto w-full flex flex-col gap-6 md:gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Dashboard Overview</h1>
          <p className="text-on-surface-variant font-body-sm text-body-sm">Real-time status of logistics and financial verification.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none border border-outline text-primary px-4 py-2 rounded font-label-caps text-label-caps hover:bg-surface-container transition-colors">Export Report</button>
          <Link href="/manufacturer/batches/create" className="flex-1 md:flex-none bg-primary text-on-primary px-4 py-2 rounded font-label-caps text-label-caps hover:opacity-90 transition-opacity text-center flex items-center justify-center">
            New Batch
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">layers</span>
            <span className="font-label-caps text-label-caps">Total Batches</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">1,492</div>
          <div className="text-xs text-on-surface-variant mt-2">+12% this week</div>
        </div>

        <div className="bg-[rgba(16,185,129,0.05)] border border-outline-variant border-l-[3px] border-l-success rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-4 text-success">
            <span className="material-symbols-outlined text-sm icon-fill">check_circle</span>
            <span className="font-label-caps text-label-caps">Payment Verified</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">845</div>
          <div className="text-xs text-success mt-2">All holds released</div>
        </div>

        <div className="bg-[rgba(37,99,235,0.05)] border border-outline-variant border-l-[3px] border-l-[#2563eb] rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 600" }}>verified_user</span>
            <span className="font-label-caps text-label-caps">Custody Confirmed</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">1,204</div>
          <div className="text-xs text-[#2563eb] mt-2">Pending payment validation</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            <span className="font-label-caps text-label-caps">Total Receivables</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">₦ 45.2M</div>
          <div className="text-xs text-on-surface-variant mt-2">Cleared funds</div>
        </div>

        <div className="bg-error-container/30 border border-outline-variant border-l-[3px] border-l-error rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-error">
            <span className="material-symbols-outlined text-sm icon-fill">warning</span>
            <span className="font-label-caps text-label-caps">Overdue Alerts</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-error font-data-mono">23</div>
          <div className="text-xs text-error mt-2">Requires immediate action</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-4">
        {/* Recent Scans Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#F1F5F9] px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-title-md text-title-md text-primary">Recent Scans</h2>
            <button className="text-secondary font-label-caps text-label-caps hover:underline">View All Manifests</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps text-label-caps bg-surface-bright">
                  <th className="px-6 py-3 font-semibold">Item ID</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Result</th>
                  <th className="px-6 py-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-primary">
                <tr className="border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-data-mono text-data-mono">PT-992-A4X</td>
                  <td className="px-6 py-4">Lagos Port Terminal</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-success-dim text-success px-2 py-1 rounded-full text-xs font-semibold border border-success/20">
                      <span className="material-symbols-outlined text-[14px]">check</span> Genuine
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-data-mono">10:42 AM</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-data-mono text-data-mono">PT-992-B7Y</td>
                  <td className="px-6 py-4">Abuja Dist. Center</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-error-container/50 text-error px-2 py-1 rounded-full text-xs font-semibold border border-error/20">
                      <span className="material-symbols-outlined text-[14px]">flag</span> Flagged
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-data-mono">09:15 AM</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-data-mono text-data-mono">PT-993-C1Z</td>
                  <td className="px-6 py-4">Kano Warehouse</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-success-dim text-success px-2 py-1 rounded-full text-xs font-semibold border border-success/20">
                      <span className="material-symbols-outlined text-[14px]">check</span> Genuine
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-data-mono">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagged Events Widget */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-md text-title-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-error">security_update_warning</span>
                Security Alerts
              </h3>
              <span className="bg-error text-on-error rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg border border-error/30 bg-error-container/10">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-error text-sm">Declared-Cash-No-Payment</div>
                  <div className="font-data-mono text-xs text-on-surface-variant">PT-992-B7Y</div>
                </div>
                <p className="text-xs text-on-surface-variant mb-3">Manifest declares cash received, but banking API shows no matching deposit.</p>
                <button className="w-full bg-surface-container-lowest border border-outline text-primary py-1.5 rounded text-xs font-semibold hover:bg-surface-container transition-colors">Investigate Mismatch</button>
              </div>

              <div className="p-4 rounded-lg border border-outline-variant bg-surface-bright">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-tertiary-container text-sm">Duplicate Claim Attempt</div>
                  <div className="font-data-mono text-xs text-on-surface-variant">PT-988-X2A</div>
                </div>
                <p className="text-xs text-on-surface-variant mb-3">System detected a secondary attempt to verify custody on an already cleared item.</p>
                <button className="w-full bg-surface-container-lowest border border-outline text-primary py-1.5 rounded text-xs font-semibold hover:bg-surface-container transition-colors">Review Logs</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
