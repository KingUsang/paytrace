'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManufacturerDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('paytrace_token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `₦ ${(val / 1000000).toFixed(1)}M`;
    return `₦ ${val.toLocaleString()}`;
  };
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
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">{stats ? stats.totalBatches.toLocaleString() : '...'}</div>
          <div className="text-xs text-on-surface-variant mt-2">All time</div>
        </div>

        <div className="bg-[rgba(16,185,129,0.05)] border border-outline-variant border-l-[3px] border-l-success rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-4 text-success">
            <span className="material-symbols-outlined text-sm icon-fill">check_circle</span>
            <span className="font-label-caps text-label-caps">Payment Verified</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">{stats ? stats.paymentVerified.toLocaleString() : '...'}</div>
          <div className="text-xs text-success mt-2">All holds released</div>
        </div>

        <div className="bg-[rgba(37,99,235,0.05)] border border-outline-variant border-l-[3px] border-l-[#2563eb] rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 600" }}>verified_user</span>
            <span className="font-label-caps text-label-caps">Custody Confirmed</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">{stats ? stats.custodyConfirmed.toLocaleString() : '...'}</div>
          <div className="text-xs text-[#2563eb] mt-2">Pending payment validation</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            <span className="font-label-caps text-label-caps">Total Receivables</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary font-data-mono">{stats ? formatCurrency(stats.totalReceivables) : '...'}</div>
          <div className="text-xs text-on-surface-variant mt-2">Cleared funds</div>
        </div>

        <div className="bg-error-container/30 border border-outline-variant border-l-[3px] border-l-error rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-error">
            <span className="material-symbols-outlined text-sm icon-fill">warning</span>
            <span className="font-label-caps text-label-caps">Overdue Alerts</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-error font-data-mono">{stats ? stats.overdueAlerts.toLocaleString() : '...'}</div>
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
                {stats?.recentScans?.length > 0 ? stats.recentScans.map((scan: any, idx: number) => (
                  <tr key={idx} className="border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-data-mono text-data-mono">{scan.item_code}</td>
                    <td className="px-6 py-4">{scan.location}</td>
                    <td className="px-6 py-4">
                      {scan.result === 'GENUINE' ? (
                        <span className="inline-flex items-center gap-1 bg-success-dim text-success px-2 py-1 rounded-full text-xs font-semibold border border-success/20">
                          <span className="material-symbols-outlined text-[14px]">check</span> Genuine
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-error-container/50 text-error px-2 py-1 rounded-full text-xs font-semibold border border-error/20">
                          <span className="material-symbols-outlined text-[14px]">flag</span> Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-data-mono">
                      {new Date(scan.scanned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-on-surface-variant">No recent scans</td></tr>
                )}
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
              <span className="bg-error text-on-error rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{stats?.securityAlerts?.length || 0}</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {stats?.securityAlerts?.length > 0 ? stats.securityAlerts.map((alert: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg border border-error/30 bg-error-container/10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-error text-sm">{alert.flag_reason || 'Anomaly Detected'}</div>
                    <div className="font-data-mono text-xs text-on-surface-variant">{alert.item_code}</div>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-3">Scanned at: {alert.location}</p>
                  <button className="w-full bg-surface-container-lowest border border-outline text-primary py-1.5 rounded text-xs font-semibold hover:bg-surface-container transition-colors">Investigate Alert</button>
                </div>
              )) : (
                <div className="text-on-surface-variant text-sm text-center py-4">No active alerts.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
