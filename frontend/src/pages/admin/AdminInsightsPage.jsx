import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  TrendingUp, 
  Database, 
  HelpCircle, 
  ShieldCheck 
} from 'lucide-react';

export function AdminInsightsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [actingId, setActingId] = useState(null);
  const [seedNotice, setSeedNotice] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recsRes, analyticsRes] = await Promise.all([
        api.get('/admin/recommendations'),
        api.get('/admin/analytics')
      ]);

      setRecommendations(recsRes.recommendations || []);
      setEvaluation(analyticsRes.predictionEvaluation || null);
    } catch (err) {
      setError(err.message || 'Failed to load operations insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActingId(id);
      await api.post(`/admin/recommendations/${id}/approve`);
      await fetchInsights();
    } catch (err) {
      alert('Approval failed: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActingId(id);
      await api.post(`/admin/recommendations/${id}/reject`);
      await fetchInsights();
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    } finally {
      setActingId(null);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setSeeding(true);
      const res = await api.post('/admin/analytics/seed-demo', { count: 25 });
      setSeedNotice(res.message);
      await fetchInsights();
      setTimeout(() => setSeedNotice(null), 5000);
    } catch (err) {
      alert('Seeding failed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="card state-box">
        <div className="spinner"></div>
        <p>Analyzing queue congestion and evaluating prediction accuracy metrics...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Operations Insights & Workload Optimizer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Adaptive counter load-sharing recommendations and closed-loop prediction accuracy evaluation.
          </p>
        </div>

        <button onClick={fetchInsights} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Insights
        </button>
      </div>

      {seedNotice && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{seedNotice}</span>
        </div>
      )}

      {/* SECTION 1: Adaptive Counter Workload Recommendations */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Adaptive Optimizer
            </div>
            <h2 className="card-title">Counter Load-Balancing Recommendations</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Engine automatically identifies congested queues and recommends certified underutilized counters.
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CheckCircle2 size={36} color="var(--teal)" style={{ margin: '0 auto 0.5rem' }} />
            <p><strong>All Counter Queues Optimal</strong></p>
            <p style={{ fontSize: '0.825rem' }}>No counter currently exceeds the congestion threshold (Queue &gt; 3 or Delay &gt; 30m).</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendations.map((rec) => {
              const isPending = rec.status === 'pending';
              const isActing = actingId === rec.id;
              return (
                <div
                  key={rec.id}
                  style={{
                    border: isPending ? '1px solid #bfdbfe' : '1px solid var(--border)',
                    background: isPending ? '#eff6ff' : '#f8fafc',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={18} color={isPending ? 'var(--primary)' : '#64748b'} />
                      <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>
                        Rebalance: {rec.sourceCounter?.counter_label} → {rec.targetCounter?.counter_label}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        Expected Wait Reduction: -{rec.expected_wait_reduction_minutes}m
                      </span>
                      <span className={`badge ${isPending ? 'badge-warning' : rec.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                        {rec.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--navy-800)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {rec.rationale}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Service: <strong>{rec.service?.name}</strong></span>

                    {isPending ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleReject(rec.id)}
                          disabled={isActing}
                          className="btn btn-secondary btn-sm"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          onClick={() => handleApprove(rec.id)}
                          disabled={isActing}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 size={14} /> Approve Reassignment
                        </button>
                      </div>
                    ) : (
                      <span>Decision recorded in administrative audit logs.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Prediction Accuracy & Viva Demonstration Module */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Academic Evaluation Module
            </div>
            <h2 className="card-title">Prediction Engine Accuracy Telemetry</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Empirical verification comparing forecasted wait times against observed service outcomes.
            </p>
          </div>

          <button
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="btn btn-secondary btn-sm"
            title="Seed 25 synthetic completed records to demonstrate MAE/MAPE live"
          >
            <Database size={14} />
            {seeding ? 'Seeding Demo Data...' : '⚡ Seed 25 Synthetic Records for Viva'}
          </button>
        </div>

        {evaluation && !evaluation.sufficientData ? (
          /* Insufficient Data State required by Section 12 */
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
            <HelpCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
              Insufficient Observations
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
              {evaluation.message}
            </p>
            <button onClick={handleSeedDemoData} disabled={seeding} className="btn btn-primary btn-sm">
              <Database size={14} /> Load Synthetic Demonstration Dataset
            </button>
          </div>
        ) : evaluation && evaluation.sufficientData ? (
          /* Robust Accuracy Metrics Available */
          <div>
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mean Absolute Error (MAE)
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
                  {evaluation.meanAbsoluteErrorMinutes} min
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Average divergence from actual wait
                </span>
              </div>

              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mean Absolute Percentage Error
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal)', margin: '0.25rem 0' }}>
                  {evaluation.meanAbsolutePercentageErrorPercent}%
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  MAPE (relative forecasting error)
                </span>
              </div>

              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Evaluated Sample Size
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
                  {evaluation.evaluatedObservationsCount}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Completed observations evaluated
                </span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} />
              <span><strong>Model Performance Rating:</strong> {evaluation.accuracyInterpretation} (MAE ≤ 3.5m indicates strong operational queue alignment).</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
