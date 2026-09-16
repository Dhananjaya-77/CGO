import React, { useState } from 'react';
import { 
  FiGrid, 
  FiSearch, 
  FiBell, 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import cgoLogo from '../assets/cgo-logo.png';

export default function InspectorDashboard() {
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: '', type: '' });

  // Registration Form State
  const [formData, setFormData] = useState({
    containerId: '',
    deviceId: '',
    origin: '',
    destination: '',
    unlockCode: ''
  });

  // Inspection State
  const [searchContainerId, setSearchContainerId] = useState('');
  const [searchedShipment, setSearchedShipment] = useState(null);
  const [unlockCodeInput, setUnlockCodeInput] = useState('');

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: '', type: '' }), 5000);
  };

  // Submit Registration (POST)
  const handleInitialize = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/inspector/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        showAlert(`Shipment #${data.containerId || formData.containerId} registered and Smart Seal locked.`, 'success');
        setFormData({
          containerId: '',
          deviceId: '',
          origin: '',
          destination: '',
          unlockCode: ''
        });
      } else {
        showAlert('Failed to register container. Please verify inputs.', 'danger');
      }
    } catch (err) {
      showAlert('Cannot connect to Spring Boot server.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Search Container (GET)
  const handleSearchContainer = async (e) => {
    e.preventDefault();
    if (!searchContainerId.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/inspector/container/${searchContainerId.trim()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchedShipment(data);
        showAlert('Container details retrieved.', 'success');
      } else {
        setSearchedShipment(null);
        showAlert('Container not found with given ID.', 'danger');
      }
    } catch (err) {
      showAlert('Server connection error during search.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Unlock Seal (POST)
  const handleUnlockSeal = async (e) => {
    e.preventDefault();
    if (!searchedShipment || !unlockCodeInput.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/inspector/unlock-seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerId: searchedShipment.containerId,
          unlockCode: unlockCodeInput.trim()
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setSearchedShipment(updated);
        showAlert('Electronic Seal unlocked successfully. Clearance granted.', 'success');
        setUnlockCodeInput('');
      } else {
        showAlert('Invalid Passcode or clearance failure.', 'danger');
      }
    } catch (err) {
      showAlert('Server connection error during unlock.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f1f5f9', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* 1. Left Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#0b192c', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', flexShrink: 0 }}>
        <div>
          {/* Logo Section - Large Circular Container */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '105px',
              height: '105px',
              margin: '0 auto',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <img
                src={cgoLogo}
                alt="CGO Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              type="button"
              onClick={() => setActiveTab('register')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'register' ? '#1e3a8a' : 'transparent',
                color: activeTab === 'register' ? '#fff' : '#94a3b8',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <FiGrid size={18} />
              <span>Dashboard </span>
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('inspect')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'inspect' ? '#1e3a8a' : 'transparent',
                color: activeTab === 'inspect' ? '#fff' : '#94a3b8',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <FiSearch size={18} />
              <span>Inspect & Clearance</span>
            </button>

            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              <FiBell size={18} />
              <span>Alerts</span>
            </button>

            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              <FiUsers size={18} />
              <span>Admin Panel</span>
            </button>

            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              <FiFileText size={18} />
              <span>Reports</span>
            </button>

            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              <FiSettings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Officer Profile Footer */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Officer K. Silva</div>
          <div style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '12px' }}>Field Inspector</div>
          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: 0 }}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Workspace */}
      <main style={{ flex: 1, padding: '30px 40px', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>Container Monitoring System</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Sri Lanka Customs</p>
          </div>
          <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            ● Live Tracking Active
          </div>
        </header>

        {/* 4 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Active Shipments</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>24</div>
            </div>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>📦</div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Alerts</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginTop: '4px' }}>3</div>
            </div>
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>⚠️</div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '12px' }}>On-Time Delivery</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>94%</div>
            </div>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>↗</div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Avg. Transit Time</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>4.2h</div>
            </div>
            <div style={{ background: '#faf5ff', color: '#9333ea', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>🕒</div>
          </div>
        </div>

        {/* Alert Feedback Banner */}
        {alert.msg && (
          <div style={{
            backgroundColor: alert.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: alert.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${alert.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {alert.msg}
          </div>
        )}

        {/* Workspace: 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Action Panel */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            
            {/* REGISTER TAB */}
            {activeTab === 'register' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Initialize Tracking</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Pairing Module</span>
                </div>

                <form onSubmit={handleInitialize}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>CONTAINER NUMBER</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CNT-2024-001" 
                        required 
                        value={formData.containerId}
                        onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>SMART SEAL / DEVICE ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. DEV-8839" 
                        required 
                        value={formData.deviceId}
                        onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>ORIGIN</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Colombo Port" 
                        required 
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>DESTINATION</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Katunayake EPZ" 
                        required 
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>ELECTRONIC SEAL PASSCODE</label>
                    <input 
                      type="password" 
                      placeholder="Set 4-Digit Secret Code" 
                      required 
                      value={formData.unlockCode}
                      onChange={(e) => setFormData({ ...formData, unlockCode: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ backgroundColor: '#0a192f', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                  >
                    {loading ? 'Processing...' : 'Activate Tracking & Lock Seal'}
                  </button>
                </form>
              </div>
            )}

            {/* INSPECT TAB */}
            {activeTab === 'inspect' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Inspect & Clearance</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Release Module</span>
                </div>

                <form onSubmit={handleSearchContainer} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. CNT-2024-001" 
                    required 
                    value={searchContainerId}
                    onChange={(e) => setSearchContainerId(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                  <button type="submit" disabled={loading} style={{ backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {searchedShipment && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <strong style={{ fontSize: '15px' }}>{searchedShipment.containerId}</strong>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: searchedShipment.status === 'UNLOCKED' ? '#dcfce7' : '#fee2e2',
                        color: searchedShipment.status === 'UNLOCKED' ? '#166534' : '#991b1b'
                      }}>
                        {searchedShipment.status || 'LOCKED'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                      <div>Device ID: <strong>{searchedShipment.deviceId || 'N/A'}</strong></div>
                      <div>Origin: <strong>{searchedShipment.origin || 'N/A'}</strong></div>
                      <div>Destination: <strong>{searchedShipment.destination || 'N/A'}</strong></div>
                    </div>

                    <form onSubmit={handleUnlockSeal} style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="password" 
                        placeholder="Enter Authorization Passcode" 
                        required 
                        value={unlockCodeInput}
                        onChange={(e) => setUnlockCodeInput(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                      <button type="submit" disabled={loading} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {loading ? 'Verifying...' : 'Unlock Seal'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Panel: Alerts & Shipments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Active Alerts Card */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>Active Alerts</h4>
                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>View all</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Route Deviation - Red Banner */}
                <div style={{
                  backgroundColor: '#fff1f2',
                  borderLeft: '4px solid #ef4444',
                  padding: '12px 14px',
                  borderRadius: '0 6px 6px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#991b1b' }}>Route Deviation</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>CNT-2024-002</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>5 min ago</span>
                </div>

                {/* Tamper Alert - Yellow Banner */}
                <div style={{
                  backgroundColor: '#fffbeb',
                  borderLeft: '4px solid #f59e0b',
                  padding: '12px 14px',
                  borderRadius: '0 6px 6px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#92400e' }}>Tamper Alert</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>CNT-2024-007</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>12 min ago</span>
                </div>
              </div>
            </div>

            {/* Active Shipments Card */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>Active Shipments</h4>
                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>Filter</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Shipment 1 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>CNT-2024-001</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Colombo → Galle • Driver: Perera</div>
                  </div>
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    ACTIVE
                  </span>
                </div>

                {/* Shipment 2 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>CNT-2024-004</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Colombo → Katunayake • Driver: Silva</div>
                  </div>
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}