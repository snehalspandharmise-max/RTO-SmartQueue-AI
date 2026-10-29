import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#1d4ed8', '#0d9488', '#d97706', '#dc2626', '#64748b', '#8b5cf6'];

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, analyticsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/analytics')
      ]);
      setStats(dashRes.stats);
      setChartData(analyticsRes.chartData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="card state-box">
        <div className="spinner"></div>
        <p>Loading live operational telemetry and chart data...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="card state-box">
        <AlertTriangle size={42} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>Telemetry Error</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
            Operational Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time queue metrics, counter utilization, and predictive accuracy telemetry.
          </p>
        </div>

        <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Telemetry
        </button>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Today's Total</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
            {stats.todayAppointments}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Appointments Today</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--amber)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Waiting Queue</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber)', margin: '0.25rem 0' }}>
            {stats.waitingQueueSize}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Citizens in Queue</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
            {stats.inProgressCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Being Served at Counters</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--teal)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal)', margin: '0.25rem 0' }}>
            {stats.completedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Services Concluded</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>No-Show Count</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', margin: '0.25rem 0' }}>
            {stats.noShowCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Absent Citizens</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Observed Wait</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
            {stats.avgObservedWaitTimeMinutes}m
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Actual Waiting Average</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Service Time</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
            {stats.avgObservedServiceDurationMinutes}m
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Observed Processing Time</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Counter Utilization</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
            {stats.counterUtilizationRatePercent}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Workload Ratio</span>
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      {chartData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Row 1: Hourly Demand & Demand by Service */}
          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                <BarChart3 size={18} color="var(--primary)" /> Appointment Demand by Operating Hour
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData.demandByHour}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                <TrendingUp size={18} color="var(--teal)" /> Appointment Demand by Service
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData.demandByService} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis dataKey="serviceCode" type="category" stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Actual vs Predicted Wait & Queue Status */}
          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                <Clock size={18} color="var(--primary)" /> Actual vs Predicted Waiting Time (Completed Tokens)
              </h3>
              {chartData.actualVsPredictedWait?.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Awaiting evaluated completed observations.
                </p>
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData.actualVsPredictedWait}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="ticket" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} unit="m" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="predicted" name="Predicted Wait (min)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="actual" name="Actual Wait (min)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                <Activity size={18} color="var(--amber)" /> Queue Status Distribution
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData.queueStatusDistribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.queueStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
