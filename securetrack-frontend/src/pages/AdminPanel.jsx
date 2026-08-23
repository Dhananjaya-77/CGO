import React, { useState, useEffect, useMemo } from 'react';
import { Users, Map, Activity, Search, Plus, Trash2, Shield, X, PowerOff } from 'lucide-react';
import api from '../api';

const TABS = [
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'geofence', label: 'Geofence Zones', icon: Map },
  { key: 'logs', label: 'System Logs', icon: Activity },
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', firstname: '', lastname: '', email: '', password: '', accountType: 'CUSTOM_OFFICER', vehicleNo: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [staffRes, driversRes] = await Promise.all([
        api.get('/api/admin/users/staff'),
        api.get('/api/admin/users/drivers')
      ]);

      const staffData = staffRes.data.map(u => ({
        id: u.staffId,
        type: 'STAFF', 
        firstname: u.firstname,
        lastname: u.lastname,
        username: u.username,
        email: u.email,
        role: u.role
      }));

      const driverData = driversRes.data.map(u => ({
        id: u.driverId,
        type: 'DRIVER',
        firstname: u.firstname,
        lastname: u.lastname,
        username: u.username,
        email: u.email,
        role: 'DRIVER'
      }));

      setUsersList([...staffData, ...driverData]);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/users', formData);
      setFormData({ username: '', firstname: '', lastname: '', email: '', password: '', accountType: 'CUSTOM_OFFICER', vehicleNo: '' });
      setShowAddForm(false);
      fetchUsers(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id, type) => {
    if(window.confirm('Are you sure you want to delete this user?')) {
      try {
        if (type === 'STAFF') {
          await api.delete(`/api/admin/users/staff/${id}`);
        } else {
          alert('Driver deletion endpoint not yet configured in backend.');
          return;
        }
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const handleDeactivate = async (id, type) => {
    if(window.confirm('Are you sure you want to deactivate this account?')) {
        try {
          if (type === 'STAFF') {
            await api.put(`/api/admin/users/staff/${id}/deactivate`);
            alert('Staff account deactivated');
          }
          fetchUsers();
        } catch (err) {
          console.error("Failed to deactivate", err);
        }
      }
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return usersList;
    return usersList.filter(
      (user) =>
        (user.firstname + ' ' + user.lastname).toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
    );
  }, [search, usersList]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
          <p className="mt-1 text-sm text-slate-500">System administration and user management</p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-600">
          <Shield size={14} />
          Administrator Access
        </span>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-6">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setActiveTab(key); setShowAddForm(false); }}
              className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'border-[#0B3A5A] text-[#0B3A5A]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'users' && (
        <div className="rounded-xl bg-white shadow-sm">
          {!showAddForm && (
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#0B3A5A] focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0B3A5A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0a2f4a]"
              >
                <Plus size={16} />
                Add User
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="border-b border-gray-100 p-6 bg-slate-50 rounded-t-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Add New User</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Type / Role</label>
                  <select 
                    name="accountType" 
                    value={formData.accountType} 
                    onChange={handleInputChange} 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOM_OFFICER">Customs Officer</option>
                    <option value="INSPECTOR">Field Inspector</option>
                    <option value="DRIVER">Truck Driver</option>
                  </select>
                </div>
                
                {/* Driver තේරුවොත් පමණක් පෙන්වන Vehicle Number කොටුව */}
                {formData.accountType === 'DRIVER' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Number</label>
                    <input required type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleInputChange} placeholder="e.g. WP-LD-4582" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                  <input required type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0B3A5A]" />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="w-full sm:w-auto rounded-lg bg-[#0B3A5A] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0a2f4a]">
                    Save User
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={`${user.type}-${user.id}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{user.firstname} {user.lastname}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{user.username}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{user.email}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.type === 'DRIVER' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleDeactivate(user.id, user.type)} type="button" title="Deactivate" className="text-yellow-500 hover:text-yellow-700">
                            <PowerOff size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id, user.type)} type="button" title="Delete" className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'logs' && (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          System activity logs will be loaded from /api/admin/audit-logs
        </div>
      )}
    </div>
  );
}

export default AdminPanel;