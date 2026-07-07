export default function IncomingBatches() {
  return (
    <div>
      <h1 className="headline-lg-mobile">Incoming Allocations</h1>
      
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label-caps">Dangote Cement 50kg</span>
          <span className="data-mono" style={{ color: 'var(--secondary)' }}>200 Units</span>
        </div>
        <p className="body-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>From: Main Distributor Hub</p>
        
        <div style={{ padding: '12px', backgroundColor: 'rgba(0, 81, 213, 0.05)', borderRadius: '4px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--secondary)' }}>CREDIT TERMS: 14 DAYS</span>
        </div>

        <button className="btn-primary" style={{ width: '100%' }}>Confirm Receipt (OTP)</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label-caps">AgroChem Fertilizer</span>
          <span className="data-mono" style={{ color: 'var(--secondary)' }}>50 Units</span>
        </div>
        <p className="body-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>From: Regional Depot</p>
        
        <div style={{ padding: '12px', backgroundColor: 'rgba(0, 200, 83, 0.05)', borderRadius: '4px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#00c853' }}>CASH TERMS</span>
        </div>

        <button className="btn-secondary" style={{ width: '100%' }}>Mark Paid</button>
      </div>
    </div>
  );
}
