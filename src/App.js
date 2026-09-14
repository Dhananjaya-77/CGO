import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SidebarLayout from './components/SidebarLayout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerTracking from './pages/OwnerTracking';

// Dev check bypass
function RequireAuth({ children }) {
  // Token nathi unath dev testing waladi direct render wenna ida deema
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />

        {/* Sidebar Layout athule thiyena routes */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <SidebarLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="owner" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="owner" element={<OwnerDashboard />} />
          <Route path="owner/track/:containerId" element={<OwnerTracking />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirects */}
        <Route path="/owner" element={<Navigate to="/app/owner" replace />} />
        <Route path="*" element={<Navigate to="/app/owner" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;