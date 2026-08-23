import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../api'; // Backend එකට කතා කරන API එක

function TrendBadge({ trend, direction }) {
  const Icon = direction === 'up' ? TrendingUp : TrendingDown;
  const tone = direction === 'up' ? 'text-green-600' : 'text-red-500';
  return (
    <span className={`mt-1 flex items-center gap-1 text-xs font-medium ${tone}`}>
      <Icon size={13} />
      {trend}
    </span>
  );
}

function Reports() {
  const [reportData, setReportData] = useState({
    statCards: [],
    shipmentActivity: [],
    alertDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get('/api/reports/summary');
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading reports data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports &amp; Analytics</h2>
          <p className="mt-1 text-sm text-slate-500">Generate and download system reports</p>
        </div>
        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-lg bg-[#0B3A5A] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a2f4a]"
        >
          <Download size={16} />
          Generate Report
        </button>
      </div>

      {/* Filter card */}
      <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-3">
        <div>
          <label htmlFor="report-type" className="mb-1.5 block text-sm font-medium text-slate-700">Report Type</label>
          <select id="report-type" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-700 focus:border-[#0B3A5A] focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15">
            <option>Shipment Summary</option>
            <option>Alert Summary</option>
            <option>Officer Activity</option>
          </select>
        </div>
        <div>
          <label htmlFor="date-range" className="mb-1.5 block text-sm font-medium text-slate-700">Date Range</label>
          <input id="date-range" type="text" placeholder="Select date range" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0B3A5A] focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15" />
        </div>
        <div>
          <label htmlFor="export-format" className="mb-1.5 block text-sm font-medium text-slate-700">Export Format</label>
          <select id="export-format" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-700 focus:border-[#0B3A5A] focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15">
            <option>PDF</option>
            <option>CSV</option>
            <option>Excel</option>
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportData.statCards.map(({ label, value, trend, direction }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            <TrendBadge trend={trend} direction={direction} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">Shipment Activity (This Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.shipmentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="shipments" name="Shipments" fill="#0B3A5A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">Alert Distribution by Type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.alertDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.alertDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;