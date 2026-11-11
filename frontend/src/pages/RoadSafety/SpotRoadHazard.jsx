import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export function SpotRoadHazard() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [spottedHazards, setSpottedHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const hazards = [
    {
      id: 'h1',
      title: 'Deep Unmarked Pothole on Curve',
      icon: '🕳️',
      top: '68%',
      left: '28%',
      desc: 'Can blow a tire or cause a two-wheeler rider to lose balance and fall under traffic.',
      defense: 'Scan 10-15 seconds ahead, avoid sudden swerving into adjacent lanes, and brake gently in a straight line.'
    },
    {
      id: 'h2',
      title: 'Pedestrian Stepping from Behind Bus',
      icon: '🚶',
      top: '42%',
      left: '65%',
      desc: 'Pedestrian hidden in blind spot stepping directly into moving traffic without looking.',
      defense: 'Always slow down significantly when overtaking or passing stopped buses or auto-rickshaws at halts.'
    },
    {
      id: 'h3',
      title: 'Auto-Rickshaw Cutting Across Lanes',
      icon: '🛺',
      top: '55%',
      left: '45%',
      desc: 'Abrupt lane cut without indicator or shoulder check.',
      defense: 'Maintain a 3-second safe following distance and anticipate sudden passenger drop-offs.'
    },
    {
      id: 'h4',
      title: 'Two-Wheeler Without Helmet in Left Blind Spot',
      icon: '🛵',
      top: '60%',
      left: '12%',
      desc: 'Motorcyclist riding without ISI helmet in passenger blind spot.',
      defense: 'Always check side mirrors and physically check your shoulder blind spot before turning or merging left.'
    },
    {
      id: 'h5',
      title: 'Stalled Truck Without Warning Triangles',
      icon: '🚛',
      top: '32%',
      left: '78%',
      desc: 'Heavy commercial vehicle halted on highway lane with no hazard triangles or parking lights at dusk.',
      defense: 'High-beam / low-beam switching at night, and maintain extra vigilance on highway shoulders.'
    },
    {
      id: 'h6',
      title: 'Parked Car Door Opening (Dooring Hazard)',
      icon: '🚪',
      top: '50%',
      left: '88%',
      desc: 'Driver opening car door into active traffic stream.',
      defense: 'Use the Dutch Reach technique when opening doors, and pass parked cars with at least 1-meter door clearance.'
    },
    {
      id: 'h7',
      title: 'Oil Spill on Wet Asphalt Turn',
      icon: '🛢️',
      top: '78%',
      left: '52%',
      desc: 'Slick diesel or engine oil film creating zero traction on turn.',
      defense: 'Avoid sharp steering or hard braking on discolored shiny asphalt patches; coast smoothly through.'
    }
  ];

  // Timer hook
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startGame = () => {
    setTimeLeft(60);
    setSpottedHazards([]);
    setSelectedHazard(null);
    setIsGameOver(false);
    setIsRunning(true);
  };

  const spotHazard = (h) => {
    if (!isRunning || isGameOver) return;
    if (!spottedHazards.includes(h.id)) {
      const next = [...spottedHazards, h.id];
      setSpottedHazards(next);
      setSelectedHazard(h);

      if (next.length === hazards.length) {
        setIsGameOver(true);
        setIsRunning(false);
        const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
        localStorage.setItem('rto_user_xp', String(currentXp + 150));
      }
    } else {
      setSelectedHazard(h);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          ⚠️ Game 3: Spot the Road Hazard
        </span>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0 0 0.25rem' }}>
              Hazard Perception Scene
            </h2>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Identify all 7 dangerous real-world Indian road hazards before time runs out.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: timeLeft < 15 ? '#fee2e2' : '#f1f5f9',
              color: timeLeft < 15 ? 'var(--transport-red)' : 'var(--navy-900)',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <Clock size={16} /> {timeLeft}s
            </div>

            <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              Spotted: {spottedHazards.length} / {hazards.length}
            </span>
          </div>
        </div>

        {/* Start Game Trigger if not started */}
        {!isRunning && !isGameOver && spottedHazards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', marginBottom: '1.5rem' }}>
            <AlertTriangle size={42} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
              Ready to Test Your Road Perception?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Click directly on hazards concealed in the multi-lane urban road scene below as quickly as possible.
            </p>
            <button onClick={startGame} className="btn btn-primary btn-lg" style={{ background: 'var(--transport-red)', border: 'none' }}>
              Start Hazard Scan (60s)
            </button>
          </div>
        )}

        {/* The Interactive Road Scene */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          background: 'linear-gradient(to bottom, #94a3b8 0%, #475569 35%, #1e293b 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
          marginBottom: '1.5rem',
          cursor: isRunning ? 'crosshair' : 'default'
        }}>
          {/* Horizon & Sky Backdrop */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to bottom, #60a5fa 0%, #cbd5e1 100%)' }}>
            {/* Urban Skyline Silhouette */}
            <div style={{ position: 'absolute', bottom: 0, left: '10%', fontSize: '2.5rem', opacity: 0.35 }}>🏢 🏬 🏭 🏢</div>
            <div style={{ position: 'absolute', bottom: 0, right: '15%', fontSize: '2.5rem', opacity: 0.35 }}>🏢 🏣 🏨</div>
          </div>

          {/* Perspective Asphalt Road */}
          <div style={{
            position: 'absolute',
            top: '35%',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1e293b',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)'
          }}>
            {/* Center Dashed Lane Markers */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '8px',
              height: '100%',
              backgroundImage: 'repeating-linear-gradient(to bottom, #fde047 0, #fde047 30px, transparent 30px, transparent 60px)',
              transform: 'translateX(-50%)'
            }} />
          </div>

          {/* Left Footpath / Shoulder */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '15%', height: '65%', background: '#94a3b8', borderRight: '4px solid #f8fafc' }} />
          {/* Right Footpath / Shoulder */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15%', height: '65%', background: '#94a3b8', borderLeft: '4px solid #f8fafc' }} />

          {/* Clickable Hazard Objects */}
          {hazards.map((h) => {
            const isSpotted = spottedHazards.includes(h.id);
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => spotHazard(h)}
                title={isSpotted ? h.title : 'Suspicious hazard? Click to inspect'}
                style={{
                  position: 'absolute',
                  top: h.top,
                  left: h.left,
                  background: isSpotted ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                  border: isSpotted ? '3px solid #22c55e' : '1px dashed rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  cursor: isRunning ? 'pointer' : 'default',
                  boxShadow: isSpotted ? '0 0 16px #22c55e' : 'none',
                  transition: 'all 0.2s ease',
                  animation: !isSpotted && isRunning ? 'pulse 2s infinite' : 'none'
                }}
              >
                <span>{h.icon}</span>
                {isSpotted && (
                  <CheckCircle2 size={16} color="#22c55e" style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ffffff', borderRadius: '50%' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Hazard Detail Drawer */}
        {selectedHazard && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{selectedHazard.icon}</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                {selectedHazard.title} (Hazard Identified)
              </h4>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#14532d', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              <strong>Danger:</strong> {selectedHazard.desc}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#166534', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #86efac' }}>
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
              <strong>Defensive Driving Technique:</strong> {selectedHazard.defense}
            </div>
          </div>
        )}

        {/* Game Over Summary */}
        {isGameOver && (
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              {spottedHazards.length === hazards.length ? '🎉 All Hazards Identified!' : 'Time Elapsed!'}
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              You spotted <strong>{spottedHazards.length} out of {hazards.length}</strong> hazards.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={startGame} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={15} /> Play Again
              </button>
              <Link to="/road-safety/simulator" className="btn btn-primary" style={{ background: 'var(--transport-red)', border: 'none' }}>
                Play Game 4: 2D Safe Driving Simulator →
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
