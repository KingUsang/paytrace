export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#1e293b', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--background)', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.5)', position: 'relative' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>PayTrace Mobile</span>
          <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Profile</span>
        </div>
        <div style={{ padding: '24px 16px' }}>
          {children}
        </div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--surface-container-lowest)', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>Incoming</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Inventory</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>History</span>
        </div>
      </div>
    </div>
  );
}
