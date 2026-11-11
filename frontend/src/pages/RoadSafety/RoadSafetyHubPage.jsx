import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Award,
  ShieldAlert,
  Flame,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Car,
  Compass,
  FileCheck
} from 'lucide-react';
import { ROAD_SIGNS, LL_QUESTIONS } from '../../data/portalData';

export function RoadSafetyHubPage() {
  const [xp, setXp] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);

  useEffect(() => {
    const storedXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
    setXp(storedXp);
    const storedCompleted = JSON.parse(localStorage.getItem('rto_completed_games') || '["ll-test"]');
    setCompletedGames(storedCompleted);
  }, []);

  const games = [
    {
      id: 'road-sign-challenge',
      title: 'Road Sign Challenge',
      desc: 'Identify Mandatory, Cautionary, and Informatory traffic signs across 3 progressive difficulty levels.',
      category: 'Signs & Rules',
      difficulty: 'Easy / Medium',
      duration: '3 mins',
      xpReward: '+100 XP',
      icon: '🚦',
      path: '/road-safety/sign-challenge',
      featured: true
    },
    {
      id: 'traffic-signal-master',
      title: 'Traffic Signal Master',
      desc: 'Master complex intersection signals, amber transitions, flashing red stops, and green arrows.',
      category: 'Intersection Rules',
      difficulty: 'Medium',
      duration: '4 mins',
      xpReward: '+120 XP',
      icon: '🚥',
      path: '/road-safety/signal-master'
    },
    {
      id: 'spot-road-hazard',
      title: 'Spot the Road Hazard',
      desc: 'Scan high-density Indian urban and highway driving scenes to identify dangerous road hazards.',
      category: 'Hazard Perception',
      difficulty: 'Medium / Hard',
      duration: '5 mins',
      xpReward: '+150 XP',
      icon: '⚠️',
      path: '/road-safety/spot-hazard'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
      
      {/* 1. HERO HUB BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 60%, var(--transport-red) 120%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Gamepad2 size={15} />
            <span>Interactive Road Safety Learning & Gaming Centre</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Learn Traffic Rules, Play 3 Interactive Games & <span style={{ color: 'var(--accent-gold)' }}>Earn Certification</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem' }}>
            Designed to transform driver education into an engaging public safety movement. 
            Prepare for your Sarathi Learner's Licence test, hone hazard anticipation skills, and earn your verified certificate.
          </p>

          {/* Gamification Stats Strip */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.2)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} color="var(--accent-gold)" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', lineHeight: 1 }}>Total XP</span>
                <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{xp} XP</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#38bdf8" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', lineHeight: 1 }}>Safety Rank</span>
                <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>Level 3 Scholar</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', lineHeight: 1 }}>Completed</span>
                <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{completedGames.length} / 3 Modules</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACCESS BUTTONS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/road-safety/sign-challenge" className="btn btn-primary" style={{ background: "var(--transport-red)", border: "none" }}>
          🚦 Start Road Sign Challenge
        </Link>
        <Link to="/road-safety/signs" className="btn btn-secondary">
          🛑 Browse Road Signs Library
        </Link>
      </div>

      {/* 3. 3 INTERACTIVE GAMES GRID */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-error" style={{ marginBottom: '0.3rem' }}>3 Interactive Games</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Choose Your Learning Challenge
          </h2>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {games.map(game => (
            <div
              key={game.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: game.featured ? '4px solid var(--transport-red)' : '4px solid var(--accent-gold)',
                padding: '1.75rem',
                position: 'relative'
              }}
            >
              {game.featured && (
                <span className="badge badge-error" style={{ position: 'absolute', top: '-12px', right: '16px', fontSize: '0.65rem' }}>
                  ★ Most Popular
                </span>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{game.icon}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{game.duration}</span>
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem', fontWeight: 700 }}>{game.xpReward}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                  {game.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {game.desc}
                </p>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {game.category}
                </span>
                <Link
                  to={game.path}
                  className="btn btn-sm"
                  style={{
                    background: game.featured ? 'var(--transport-red)' : 'var(--navy-800)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    padding: '0.4rem 0.9rem'
                  }}
                >
                  Play Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VERIFIABLE CERTIFICATE SECTION */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #fdf6ea 0%, #fffbeb 100%)',
        border: '2px solid var(--accent-gold)',
        padding: '2.5rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Road Safety</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Road Safety Achievement Certificate
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--navy-800)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Complete any of the 3 games to earn your verified Road Safety Achievement Certificate with your name and completion date.
            </p>
            <Link to="/road-safety/certificate" className="btn btn-primary" style={{ background: 'var(--accent-gold)', color: 'var(--navy-900)', fontWeight: 700, border: 'none' }}>
              <Award size={16} /> Open Certificate Generator →
            </Link>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fed7aa', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sample Certificate Preview
            </div>
            <div style={{ border: '2px dashed #fed7aa', margin: '0.85rem 0', padding: '1.25rem', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0 0 0.25rem' }}>
                CERTIFICATE OF ROAD SAFETY PROFICIENCY
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Awarded for successfully demonstrating mastery over Motor Vehicle Rules, Road Signs, and Defensive Driving Principles.
              </p>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Issued by RTO SmartQueue AI — Maharashtra Citizen Transport Platform.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}


