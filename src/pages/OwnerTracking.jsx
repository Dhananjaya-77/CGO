import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OwnerTracking = () => {
  const { containerId } = useParams();
  const navigate = useNavigate();
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/owner/track/${containerId}`)
      .then((res) => {
        setTrackData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [containerId]);

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <button 
        onClick={() => navigate('/owner')} 
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
      >
        &larr; Back to Dashboard
      </button>

      {loading ? (
        <p>Fetching Real-Time Telemetry...</p>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Live Telemetry: {trackData?.containerId}</h2>
            <span style={{ backgroundColor: '#22c55e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              GPS LOCK ACTIVE &bull; ONLINE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Map Display Card */}
            <div style={{ height: '420px', backgroundColor: '#0f172a', borderRadius: '10px', padding: '25px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, color: '#38bdf8' }}>GIS Real-Time Location Map</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Tracking coordinates transmitted by ESP32 Edge Device</p>
              </div>

              <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>Lat: {trackData?.currentLat} &bull; Lng: {trackData?.currentLng}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>Location: Baseline Road Corridor, Colombo</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #334155', paddingTop: '15px', fontSize: '13px' }}>
                <span>Speed: <strong>{trackData?.speed}</strong></span>
                <span>Temp: <strong>{trackData?.temperature}</strong></span>
                <span>Telemetry: <strong>{trackData?.lastPing}</strong></span>
              </div>
            </div>

            {/* Milestones & Security Status */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: '#f8fafc' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Security & Seal State</h3>
              <p style={{ fontSize: '14px' }}><strong>Electronic Seal:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>SECURE (LOCKED)</span></p>
              <p style={{ fontSize: '14px' }}><strong>Corridor Tamper Alert:</strong> <span style={{ color: '#0284c7', fontWeight: 'bold' }}>0 Anomalies</span></p>

              <h4 style={{ marginTop: '25px', marginBottom: '15px', fontSize: '15px' }}>Route Progress</h4>
              <div style={{ fontSize: '13px' }}>
                {trackData?.milestones?.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: m.completed ? '#22c55e' : '#cbd5e1', marginRight: '10px', display: 'inline-block' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: m.completed ? 'bold' : 'normal', color: m.completed ? '#0f172a' : '#64748b' }}>{m.stage}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerTracking;