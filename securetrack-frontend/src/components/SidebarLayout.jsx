import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  Bell,
  Users,
  FileText,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Dashboard', icon: Home, roles: ['ADMIN', 'CUSTOM_OFFICER'] },
  { to: '/app/alerts', label: 'Alerts', icon: Bell, roles: ['ADMIN', 'CUSTOM_OFFICER'] },
  { to: '/app/admin', label: 'Admin Panel', icon: Users, roles: ['ADMIN'] }, // Admin ට පමණයි
  { to: '/app/reports', label: 'Reports', icon: FileText, roles: ['ADMIN', 'CUSTOM_OFFICER'] },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon, roles: ['ADMIN', 'CUSTOM_OFFICER', 'INSPECTOR', 'DRIVER'] },
];

export function CgoLogo({ size = 96 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="CGO Secure Transit">
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#0B3A5A" strokeWidth="1.5" />
      <text x="50" y="24" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0B3A5A" letterSpacing="1">CGO</text>
      <circle cx="50" cy="50" r="20" fill="#0B3A5A" />
      <path
        d="M50 34 C58 34 64 40 64 48 C64 54 60 58 56 60 L56 66 L44 66 L44 60 C40 58 36 54 36 48 C36 40 42 34 50 34 Z"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <path d="M43 48 a7 7 0 0 1 14 0" fill="none" stroke="#7dd3fc" strokeWidth="1.4" />
      <text x="50" y="80" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0B3A5A" letterSpacing="0.5">CGO</text>
      <text x="50" y="88" textAnchor="middle" fontSize="4.2" fill="#0B3A5A" letterSpacing="1">SECURE TRANSIT</text>
    </svg>
  );
}

function SidebarLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ username: 'User', role: 'UNKNOWN' });


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        
        setCurrentUser({
          username: decoded.sub || decoded.username || 'Officer',
          role: decoded.role || 'CUSTOMS_OFFICER' 
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ===================== Sidebar ===================== */}
      <aside className="flex w-64 flex-shrink-0 flex-col bg-[#0B3A5A]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 border-b border-white/10 px-6 py-8">
          <CgoLogo size={88} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {filteredNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-sky-400 bg-white/10 text-white'
                    : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Officer profile + logout */}
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 rounded-lg bg-white/5 px-3 py-2.5">
            <p className="text-sm font-semibold text-white capitalize">{currentUser.username}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===================== Main content ===================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Container Monitoring System</h1>
            <p className="text-sm text-slate-500">Sri Lanka Customs</p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live Tracking Active
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;