import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Flame, Shield, ArrowLeft, CheckCircle2, Star, Sparkles } from 'lucide-react';

export function RoadSafetyChampionship() {
  const [xp, setXp] = useState(250);
  const [streak, setStreak] = useState(4);

  useEffect(() => {
    const storedXp = parseInt(localStorage.getItem('rto_user_xp') || '450', 10);
    setXp(storedXp);
  }, []);

  const badges = [
    { id: 'b1', name: 'Road Sign Master', desc: 'Identified all mandatory & cautionary signs without error.', icon: '🛑', unlocked: true },
    { id: 'b2', name: 'Signal Specialist', desc: 'Mastered 4-way intersections and flashing yellow lights.', icon: '🚦', unlocked: true },
    { id: 'b3', name: 'Hazard Perception Pro', desc: 'Identified 7 complex hazards in urban driving scene.', icon: '⚠️', unlocked: true },
    { id: 'b4', name: 'Defensive Driver', desc: 'Completed 2D Simulator maintaining 100% speed adherence.', icon: '🚗', unlocked: xp >= 400 },
    { id: 'b5', name: 'Sarathi LL Scholar', desc: "Passed the 15-question Learner's Licence Mock Exam.", icon: '📝', unlocked: xp >= 500 },
    { id: 'b6', name: 'Safety Ambassador', desc: 'Earned and verified Academic Road Safety Certificate.', icon: '🎓', unlocked: xp >= 600 }
  ];

  const leaderboard = [
    { rank: 1, name: 'Aarav Deshmukh', city: 'Pune (MH-12)', xp: 1450, badge: 'Road Safety Champion' },
    { rank: 2, name: 'Priya Kulkarni', city: 'Mumbai (MH-01)', xp: 1320, badge: 'Master Driver' },
    { rank: 3, name: 'Rohan Patil', city: 'Nashik (MH-15)', xp: 1180, badge: 'Hazard Expert' },
    { rank: 4, name: 'Ananya Joshi', city: 'Nagpur (MH-31)', xp: 950, badge: 'Signal Pro' },
    { rank: 5, name: 'You (Citizen Candidate)', city: 'Maharashtra (MH)', xp: xp, badge: 'Safety Scholar', isUser: true },
    { rank: 6, name: 'Siddharth Shinde', city: 'Thane (MH-04)', xp: 410, badge: 'Learner' },
    { rank: 7, name: 'Sneha More', city: 'Kalyan (MH-05)', xp: 380, badge: 'Learner' }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          🏆 Game 7: Safety Championship
        </span>
      </div>

      {/* Hero Stats */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 60%, var(--primary-teal) 100%)',
        color: '#ffffff',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(233,162,59,0.2)',
          border: '2px solid var(--accent-gold)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <Trophy size={32} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Statewide Road Safety Championship
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
          Earn points by passing safety games, cultivate continuous driving discipline, and compete against peers across all Maharashtra RTO districts.
        </p>

        <div style={{ display: 'inline-flex', gap: '2rem', background: 'rgba(0,0,0,0.25)', padding: '0.75rem 2rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Your Current XP</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', display: 'block' }}>{xp} XP</strong>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem', textAlign: 'left' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Learning Streak</span>
            <strong style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Flame size={18} color="var(--transport-red)" /> {streak} Days
            </strong>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
          Safety Badges & Milestones
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {badges.map(b => (
            <div
              key={b.id}
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                border: b.unlocked ? '2px solid var(--accent-gold)' : '1px dashed #cbd5e1',
                background: b.unlocked ? '#fdf6ea' : '#f8fafc',
                opacity: b.unlocked ? 1 : 0.6,
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{b.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--navy-900)' }}>{b.name}</strong>
                  {b.unlocked && <CheckCircle2 size={14} color="var(--success)" />}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
          Maharashtra District Leaderboard
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Candidate Name</th>
                <th>District / Jurisdiction</th>
                <th>Safety Title</th>
                <th style={{ textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(u => (
                <tr key={u.rank} style={{ background: u.isUser ? '#fef3c7' : 'transparent', fontWeight: u.isUser ? 700 : 500 }}>
                  <td>
                    {u.rank === 1 ? '🥇 1' : u.rank === 2 ? '🥈 2' : u.rank === 3 ? '🥉 3' : `#${u.rank}`}
                  </td>
                  <td style={{ color: u.isUser ? 'var(--navy-900)' : 'inherit' }}>
                    {u.name} {u.isUser && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>You</span>}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.city}</td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{u.badge}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-teal)' }}>
                    {u.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
