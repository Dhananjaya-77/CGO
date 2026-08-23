import React, { useState } from 'react';
import { initializeTracking, getContainerDetails, unlockSeal } from '../services/inspectorService';
import cgoLogo from '../assets/cgo-logo.png';
import './InspectorDashboard.css';

const InspectorDashboard = () => {
    const [currentNav, setCurrentNav] = useState('initialize'); // 'initialize' | 'inspect'

    // Form 1 State: Initialize Container Tracking (UC-01)
    const [initForm, setInitForm] = useState({
        containerId: '',
        deviceId: '',
        origin: '',
        destination: '',
        unlockCode: ''
    });

    // Form 2 State: Inspect & Clearance (UC-04 & UC-10)
    const [searchId, setSearchId] = useState('');
    const [containerData, setContainerData] = useState(null);
    const [passcode, setPasscode] = useState('');

    const [alert, setAlert] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    // Initialize Handler
    const handleInitialize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', msg: '' });

    console.log("Submitting Payload:", initForm); // Form දත්ත console එකට print කිරීම

    try {
        const res = await initializeTracking(initForm);
        console.log("Response:", res.data);
        setAlert({
            type: 'success',
            msg: `Shipment #${res.data.containerId} registered and Smart Seal locked.`
        });
        setInitForm({ containerId: '', deviceId: '', origin: '', destination: '', unlockCode: '' });
    } catch (err) {
        console.error("API Error Details:", err); // සැබෑ දෝෂය Console එකේ දැකීමට
        setAlert({
            type: 'error',
            msg: err.response?.data?.message || 'Failed to initialize shipment. Please check backend connection.'
        });
    } finally {
        setLoading(false);
    }
};

    // Search Handler
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;
        setLoading(true);
        setAlert({ type: '', msg: '' });
        try {
            const res = await getContainerDetails(searchId.trim());
            setContainerData(res.data);
        } catch (err) {
            setContainerData(null);
            setAlert({ type: 'error', msg: 'Container record not found.' });
        } finally {
            setLoading(false);
        }
    };

    // Unlock Seal Handler
    const handleUnlockSeal = async () => {
        if (!passcode.trim()) {
            setAlert({ type: 'error', msg: 'Authentication Code is required.' });
            return;
        }
        setLoading(true);
        try {
            const res = await unlockSeal({
                containerId: containerData.containerId,
                unlockCode: passcode
            });
            setContainerData(res.data);
            setPasscode('');
            setAlert({
                type: 'success',
                msg: 'Smart Seal unlocked successfully. Status marked as COMPLETED.'
            });
        } catch (err) {
            setAlert({ type: 'error', msg: 'Invalid Authentication Code!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cgo-app-shell">
            {/* LEFT SIDEBAR (FIGURE 3) */}
            <aside className="cgo-sidebar">
                <div className="cgo-logo-box">
                    <img src={cgoLogo} alt="CGO Seal Logo" className="cgo-logo-img" />
                </div>

                <nav className="cgo-nav-list">
                    <button 
                        className={`cgo-nav-btn ${currentNav === 'initialize' ? 'active' : ''}`}
                        onClick={() => { setCurrentNav('initialize'); setAlert({ type: '', msg: '' }); }}
                    >
                        <span>📦</span>
                        <span>Dashboard / Register</span>
                    </button>

                    <button 
                        className={`cgo-nav-btn ${currentNav === 'inspect' ? 'active' : ''}`}
                        onClick={() => { setCurrentNav('inspect'); setAlert({ type: '', msg: '' }); }}
                    >
                        <span>🔍</span>
                        <span>Inspect & Clearance</span>
                    </button>

                    <button className="cgo-nav-btn" onClick={() => alert("Customs Officer Alerts Feed")}>
                        <span>🔔</span>
                        <span>Alerts</span>
                    </button>

                    <button className="cgo-nav-btn" onClick={() => alert("Admin Panel Access Restricted")}>
                        <span>👥</span>
                        <span>Admin Panel</span>
                    </button>

                    <button className="cgo-nav-btn" onClick={() => alert("Reports View")}>
                        <span>📄</span>
                        <span>Reports</span>
                    </button>

                    <button className="cgo-nav-btn" onClick={() => alert("Settings View")}>
                        <span>⚙</span>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="cgo-user-block">
                    <div className="cgo-user-badge">
                        <h4>Officer K. Silva</h4>
                        <p>Field Inspector</p>
                    </div>
                    <button className="cgo-logout" onClick={() => alert("Logging out...")}>
                        <span>➔</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* RIGHT MAIN WORKSPACE */}
            <div className="cgo-main">
                {/* Topbar */}
                <header className="cgo-topbar">
                    <div className="cgo-title">
                        <h2>Container Monitoring System</h2>
                        <p>Sri Lanka Customs</p>
                    </div>
                    <div className="cgo-live-badge">
                        <span className="cgo-green-dot"></span>
                        Live Tracking Active
                    </div>
                </header>

                <div className="cgo-workspace">
                    {/* Stat KPI Cards (Figure 3 Style) */}
                    <section className="cgo-metrics-grid">
                        <div className="cgo-metric-box">
                            <div className="cgo-metric-info">
                                <span>Active Shipments</span>
                                <h3>24</h3>
                            </div>
                            <div className="cgo-bubble b-blue">📦</div>
                        </div>

                        <div className="cgo-metric-box">
                            <div className="cgo-metric-info">
                                <span>Alerts</span>
                                <h3>3</h3>
                            </div>
                            <div className="cgo-bubble b-red">⚠️</div>
                        </div>

                        <div className="cgo-metric-box">
                            <div className="cgo-metric-info">
                                <span>On-Time Delivery</span>
                                <h3>94%</h3>
                            </div>
                            <div className="cgo-bubble b-green">📈</div>
                        </div>

                        <div className="cgo-metric-box">
                            <div className="cgo-metric-info">
                                <span>Avg. Transit Time</span>
                                <h3>4.2h</h3>
                            </div>
                            <div className="cgo-bubble b-purple">⏱</div>
                        </div>
                    </section>

                    {/* Feedback Alert */}
                    {alert.msg && (
                        <div className={`cgo-alert-banner ${alert.type}`}>
                            {alert.msg}
                        </div>
                    )}

                    {/* 2-Column Main Workspace */}
                    <div className="cgo-dashboard-grid">
                        {/* Left Main Panel: Inspector Functions */}
                        <div className="cgo-card">
                            {currentNav === 'initialize' ? (
                                <div>
                                    <div className="cgo-card-header">
                                        <h3>Initialize Tracking (UC-01)</h3>
                                        <span>Pairing Module</span>
                                    </div>

                                    <form onSubmit={handleInitialize} className="cgo-form-2col">
                                        <div className="cgo-form-field">
                                            <label>Container Number</label>
                                            <div className="cgo-field-action">
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. CNT-2024-001"
                                                    value={initForm.containerId}
                                                    onChange={e => setInitForm({...initForm, containerId: e.target.value})}
                                                    required 
                                                />
                                                <button type="button" className="cgo-btn-outline">Scan</button>
                                            </div>
                                        </div>

                                        <div className="cgo-form-field">
                                            <label>Smart Seal / Device ID</label>
                                            <div className="cgo-field-action">
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. DEV-8839"
                                                    value={initForm.deviceId}
                                                    onChange={e => setInitForm({...initForm, deviceId: e.target.value})}
                                                    required 
                                                />
                                                <button type="button" className="cgo-btn-outline">RFID</button>
                                            </div>
                                        </div>

                                        <div className="cgo-form-field">
                                            <label>Origin</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Colombo Port"
                                                value={initForm.origin}
                                                onChange={e => setInitForm({...initForm, origin: e.target.value})}
                                                required 
                                            />
                                        </div>

                                        <div className="cgo-form-field">
                                            <label>Destination</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Katunayake EPZ"
                                                value={initForm.destination}
                                                onChange={e => setInitForm({...initForm, destination: e.target.value})}
                                                required 
                                            />
                                        </div>

                                        <div className="cgo-form-field cgo-col-full">
                                            <label>Electronic Seal Passcode</label>
                                            <input 
                                                type="password" 
                                                placeholder="Set 4-Digit Secret Code"
                                                value={initForm.unlockCode}
                                                onChange={e => setInitForm({...initForm, unlockCode: e.target.value})}
                                                required 
                                            />
                                        </div>

                                        <div className="cgo-col-full">
                                            <button type="submit" className="cgo-btn-submit" disabled={loading}>
                                                {loading ? 'Registering...' : 'Activate Tracking & Lock Seal'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <div className="cgo-card-header">
                                        <h3>Inspect Container & Clearance (UC-04)</h3>
                                        <span>Checkpoint Verification</span>
                                    </div>

                                    <form onSubmit={handleSearch} className="cgo-search-box">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Container ID to search (e.g. CNT-2024-001)..."
                                            value={searchId}
                                            onChange={e => setSearchId(e.target.value)}
                                        />
                                        <button type="submit" className="cgo-btn-submit" disabled={loading}>
                                            Search
                                        </button>
                                    </form>

                                    {containerData && (
                                        <div>
                                            <div className="cgo-detail-grid">
                                                <div className="cgo-cell">
                                                    <span>Container ID</span>
                                                    <strong>{containerData.containerId}</strong>
                                                </div>
                                                <div className="cgo-cell">
                                                    <span>Paired Device ID</span>
                                                    <strong>{containerData.deviceId}</strong>
                                                </div>
                                                <div className="cgo-cell">
                                                    <span>Shipment Status</span>
                                                    <span className={`cgo-badge ${containerData.shipmentStatus.toLowerCase()}`}>
                                                        {containerData.shipmentStatus}
                                                    </span>
                                                </div>
                                                <div className="cgo-cell">
                                                    <span>Electronic Seal</span>
                                                    <span className={`cgo-badge ${containerData.sealStatus.toLowerCase()}`}>
                                                        {containerData.sealStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="cgo-cell" style={{ marginBottom: '14px' }}>
                                                <span>Assigned Corridor</span>
                                                <strong>{containerData.origin} ➔ {containerData.destination}</strong>
                                            </div>

                                            {containerData.sealStatus === 'LOCKED' ? (
                                                <div className="cgo-unlock-block">
                                                    <input 
                                                        type="password" 
                                                        placeholder="Enter Passcode"
                                                        value={passcode}
                                                        onChange={e => setPasscode(e.target.value)}
                                                    />
                                                    <button onClick={handleUnlockSeal} className="cgo-btn-danger" disabled={loading}>
                                                        Unlock Seal & Complete
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ color: '#10B981', fontSize: '13px', fontWeight: 600 }}>
                                                    ✓ Seal is UNLOCKED. Shipment is marked as COMPLETED.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar Stack: Active Alerts & Active Shipments (Figure 3) */}
                        <div className="cgo-side-stack">
                            {/* Active Alerts Box */}
                            <div className="cgo-card">
                                <div className="cgo-card-header">
                                    <h3>Active Alerts</h3>
                                    <span>View all</span>
                                </div>
                                <div className="cgo-alert-list">
                                    <div className="cgo-alert-item">
                                        <div className="cgo-alert-text">
                                            <h5>Route Deviation</h5>
                                            <p>CNT-2024-002</p>
                                        </div>
                                        <span className="cgo-time-tag">5 min ago</span>
                                    </div>
                                    <div className="cgo-alert-item tamper">
                                        <div className="cgo-alert-text">
                                            <h5>Tamper Alert</h5>
                                            <p>CNT-2024-007</p>
                                        </div>
                                        <span className="cgo-time-tag">12 min ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Shipments Box */}
                            <div className="cgo-card">
                                <div className="cgo-card-header">
                                    <h3>Active Shipments</h3>
                                    <span>Filter</span>
                                </div>
                                <div className="cgo-shipment-list">
                                    <div className="cgo-shipment-item">
                                        <div className="cgo-shipment-top">
                                            <span>CNT-2024-001</span>
                                            <span className="cgo-badge active">Active</span>
                                        </div>
                                        <div className="cgo-shipment-bot">
                                            Colombo ➔ Galle • Driver: Perera
                                        </div>
                                    </div>
                                    <div className="cgo-shipment-item">
                                        <div className="cgo-shipment-top">
                                            <span>CNT-2024-004</span>
                                            <span className="cgo-badge active">Active</span>
                                        </div>
                                        <div className="cgo-shipment-bot">
                                            Colombo ➔ Katunayake • Driver: Silva
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectorDashboard;