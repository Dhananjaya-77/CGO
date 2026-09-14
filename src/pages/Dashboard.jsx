import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import LiveMap from '../components/LiveMap';
// api.js එක import කරගන්න (ඔයාගේ api.js තියෙන තැන අනුව path එක වෙනස් වෙන්න පුළුවන්)
import api from '../api'; 

// Fix Leaflet's default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SRI_LANKA_CENTER = [7.8731, 80.7718];

const FILTERS = ['All', 'Active', 'Alert'];

const ALERT_TONE_CLASSES = {
  red: 'border-l-4 border-red-400 bg-red-50',
  yellow: 'border-l-4 border-amber-400 bg-amber-50',
};

// මේවා තවම Backend එකෙන් එන්නේ නැති නිසා දැනට තියාගමු
const STAT_CARDS = [
  { label: 'Active Shipments', value: '24', icon: Package, tint: 'bg-blue-50 text-blue-600' },
  { label: 'Alerts', value: '3', icon: AlertTriangle, tint: 'bg-red-50 text-red-500' },
  { label: 'On-Time Delivery', value: '94%', icon: TrendingUp, tint: 'bg-green-50 text-green-600' },
  { label: 'Avg Transit Time', value: '4.2h', icon: Clock, tint: 'bg-purple-50 text-purple-600' },
];

const ACTIVE_ALERTS = [
  { id: 'CNT-2024-002', title: 'Route Deviation', time: '5 min ago', tone: 'red' },
  { id: 'CNT-2024-007', title: 'Tamper Alert', time: '12 min ago', tone: 'red' },
];

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Backend එකෙන් එන Containers ටික දාගන්න State එකක් හදමු
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Component එක Load වෙද්දී Backend එකෙන් Data ගන්න
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        // ඔයාගේ Backend එකේ URL එක (උදා: /api/containers) මෙතනට දෙන්න
        const response = await api.get('/api/containers'); 
        setContainers(response.data);
      } catch (error) {
        console.error("Error fetching containers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContainers();
  }, []);

  return (
    <div className="space-y-6">
      {/* ===================== Stat cards ===================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="flex items-start justify-between rounded-xl bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                  {/* Active Shipments ගාණ ඇත්තටම පෙන්නමු */}
                  {label === 'Active Shipments' ? containers.length : value}
              </p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>
              <Icon size={18} />
            </span>
          </div>
        ))}
      </div>

      {/* ===================== Main grid ===================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Left: map ---- */}
        <div className="relative overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-2">
          <div className="absolute right-4 top-4 z-[500] rounded-lg bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">Sri Lanka – Live Tracking</p>
            <p className="text-xs text-slate-400">Updated just now</p>
          </div>
          {/* අන්න ඒකට යටින් අපි හදපු Live Map Component එක දානවා */}
          <LiveMap />

          <div className="h-[420px] w-full lg:h-[480px]">
            <MapContainer center={SRI_LANKA_CENTER} zoom={7} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={SRI_LANKA_CENTER}>
                <Popup>Headquarters - Sri Lanka Customs</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="absolute bottom-4 left-4 z-[500] rounded-lg bg-white/95 px-4 py-3 text-sm shadow-sm backdrop-blur">
            <p className="mb-2 font-semibold text-slate-900">Status</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Active
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Alert
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Completed
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Right: filters, alerts, shipments ---- */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-900">Filter Status</p>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-[#0B3A5A] text-white'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Active Alerts</p>
              <a href="#view-all-alerts" className="text-xs font-medium text-[#0B3A5A] hover:underline">
                View all
              </a>
            </div>
            <ul className="space-y-2">
              {ACTIVE_ALERTS.map((alert) => (
                <li key={alert.id} className={`rounded-lg px-3 py-2.5 ${ALERT_TONE_CLASSES[alert.tone]}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                    <span className="text-xs text-slate-500">{alert.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{alert.id}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* මෙන්න මෙතන තමයි Backend එකේ Data පෙන්නන්නේ */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-900">Active Shipments (Live)</p>
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading containers...</p>
            ) : (
                <ul className="space-y-3">
                  {containers.length === 0 ? (
                      <p className="text-sm text-slate-500">No active shipments found.</p>
                  ) : (
                      containers.map((container) => (
                        <li key={container.containerId} className="rounded-lg border border-gray-100 p-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                              <Package size={15} className="text-slate-400" />
                              {/* මෙතනට containerCode එක දාමු */}
                              {container.containerCode || 'N/A'}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                container.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' : 
                                container.status === 'ALERT' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {container.status || 'Active'}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-500">
                              {/* origin එකක් නැති නිසා assignedRoute එක පාවිච්චි කරමු */}
                              {container.assignedRoute || 'Unknown Route'} → {container.destination || 'Unknown'}
                          </p>
                        </li>
                      ))
                  )}
                </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;