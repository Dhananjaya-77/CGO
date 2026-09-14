import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const dummyContainers = [
  {
    containerId: "CNT-2024-001",
    origin: "Colombo Port (CICT)",
    destination: "Biyagama BOI Zone",
    status: "Active",
    sealStatus: "SECURE",
    driverName: "Sunil Perera",
    vehicleNo: "WP-CAD-4589",
    eta: "45 mins",
    progress: 75
  },
  {
    containerId: "CNT-2024-002",
    origin: "Hambantota Port",
    destination: "Katunayake FTZ",
    status: "Alert",
    sealStatus: "SECURE",
    driverName: "Nimal Fernando",
    vehicleNo: "WP-GB-1120",
    eta: "2 hours",
    progress: 40
  }
];

const dummyNotifications = [
  {
    id: 1,
    title: "Route Clearance Passed",
    priority: "MEDIUM",
    desc: "Container CNT-2024-001 passed Kelaniya Geofence checkpoint.",
    time: "5 min ago"
  },
  {
    id: 2,
    title: "E-Seal Armed & Verified",
    priority: "HIGH",
    desc: "Electronic seal armed at Colombo Port Gate 04.",
    time: "15 min ago"
  }
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState(dummyContainers);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    axios.get('http://localhost:8080/api/owner/containers')
      .then(res => { if (res.data && res.data.length > 0) setContainers(res.data); })
      .catch(() => setContainers(dummyContainers));

    axios.get('http://localhost:8080/api/owner/notifications')
      .then(res => { if (res.data && res.data.length > 0) setNotifications(res.data); })
      .catch(() => setNotifications(dummyNotifications));
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Container Owner Portal</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>Real-time shipment tracking and electronic seal monitoring</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '20px', color: '#059669', fontSize: '12px', fontWeight: '600' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
          Live Tracking Active
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Total Consignments</span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', marginTop: '6px' }}>02</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>In Transit</span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284C7', marginTop: '6px' }}>01</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>E-Seal State</span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', marginTop: '6px' }}>100%</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Active Alerts</span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#EF4444', marginTop: '6px' }}>01</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('active')}
          style={{ padding: '8px 4px', border: 'none', background: 'none', borderBottom: activeTab === 'active' ? '2px solid #0F2942' : 'none', color: activeTab === 'active' ? '#0F2942' : '#64748B', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
        >
          Active Shipments
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ padding: '8px 4px', border: 'none', background: 'none', borderBottom: activeTab === 'history' ? '2px solid #0F2942' : 'none', color: activeTab === 'history' ? '#0F2942' : '#64748B', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
        >
          Shipment History
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '24px' }}>
        {/* Shipment Cards List */}
        <div>
          {containers.map((c) => (
            <div key={c.containerId} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>📦</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>{c.containerId}</span>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: c.status === 'Active' ? '#E0F2FE' : '#FEE2E2',
                  color: c.status === 'Active' ? '#0284C7' : '#DC2626'
                }}>
                  {c.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                <div><span style={{ color: '#94A3B8' }}>Route:</span> {c.origin} &rarr; {c.destination}</div>
                <div><span style={{ color: '#94A3B8' }}>Assigned Driver:</span> {c.driverName}</div>
                <div><span style={{ color: '#94A3B8' }}>Vehicle:</span> {c.vehicleNo}</div>
                <div><span style={{ color: '#94A3B8' }}>ETA:</span> <strong style={{ color: '#0F172A' }}>{c.eta}</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔒</span> E-Seal: {c.sealStatus}
                </div>
                <button 
                  onClick={() => navigate(`/app/owner/track/${c.containerId}`)}
                  style={{ backgroundColor: '#0A2540', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Live GPS Track &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts & Events Sidebar Panel */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 16px' }}>Security & Event Feed</h3>
            
            {notifications.map((n) => (
              <div key={n.id} style={{ borderLeft: n.priority === 'HIGH' ? '3px solid #EF4444' : '3px solid #0284C7', paddingLeft: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{n.title}</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;