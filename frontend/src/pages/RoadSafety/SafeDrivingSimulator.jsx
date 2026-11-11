import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Gauge, Award } from 'lucide-react';

export function SafeDrivingSimulator() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameOver
  const [speed, setSpeed] = useState(0); // km/h
  const [speedLimit, setSpeedLimit] = useState(50);
  const [safetyScore, setSafetyScore] = useState(100);
  const [distance, setDistance] = useState(0);
  const [violations, setViolations] = useState([]);

  // Game internal state ref
  const simRef = useRef({
    carX: 200,
    carY: 380,
    carWidth: 36,
    carHeight: 64,
    speed: 0,
    maxSpeed: 70,
    acceleration: 0.4,
    friction: 0.15,
    speedLimit: 50,
    score: 100,
    distance: 0,
    keys: { left: false, right: false, up: false, down: false },
    traffic: [],
    pedestrians: [],
    roadOffset: 0,
    animationId: null,
    lastFrameTime: performance.now(),
    violationsList: []
  });

  const startGame = () => {
    const sim = simRef.current;
    sim.carX = 182;
    sim.carY = 360;
    sim.speed = 25;
    sim.score = 100;
    sim.distance = 0;
    sim.traffic = [
      { x: 110, y: -100, width: 34, height: 60, speed: 20, color: '#3b82f6', type: 'car' },
      { x: 260, y: -300, width: 44, height: 90, speed: 15, color: '#eab308', type: 'truck' },
      { x: 180, y: -600, width: 28, height: 45, speed: 22, color: '#22c55e', type: 'auto' }
    ];
    sim.pedestrians = [
      { x: 50, y: -900, active: true, crossed: false }
    ];
    sim.violationsList = [];
    sim.speedLimit = 50;

    setSafetyScore(100);
    setDistance(0);
    setViolations([]);
    setGameState('playing');
  };

  const addViolation = (msg) => {
    const sim = simRef.current;
    if (!sim.violationsList.includes(msg)) {
      sim.violationsList.push(msg);
      sim.score = Math.max(0, sim.score - 15);
      setSafetyScore(sim.score);
      setViolations([...sim.violationsList]);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keys = simRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
    };

    const handleKeyUp = (e) => {
      const keys = simRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const gameLoop = () => {
      const sim = simRef.current;

      if (gameState === 'playing') {
        // Accelerate / Brake / Friction
        if (sim.keys.up) sim.speed = Math.min(sim.maxSpeed, sim.speed + sim.acceleration);
        else if (sim.keys.down) sim.speed = Math.max(0, sim.speed - sim.acceleration * 1.5);
        else sim.speed = Math.max(0, sim.speed - sim.friction);

        // Steering
        if (sim.keys.left) sim.carX = Math.max(90, sim.carX - 3.5);
        if (sim.keys.right) sim.carX = Math.min(310 - sim.carWidth, sim.carX + 3.5);

        // Speed limit check
        if (sim.speed > sim.speedLimit + 5) {
          addViolation(`Speeding: ${Math.round(sim.speed)} km/h in ${sim.speedLimit} km/h zone`);
        }

        // Advance distance & road offset
        sim.distance += Math.round(sim.speed * 0.1);
        sim.roadOffset = (sim.roadOffset + sim.speed * 0.3) % 40;

        // Dynamic speed limit based on distance
        if (sim.distance > 500 && sim.distance < 1000) {
          sim.speedLimit = 30; // School zone
        } else {
          sim.speedLimit = 50;
        }

        // Move traffic cars
        sim.traffic.forEach(t => {
          t.y += (sim.speed - t.speed) * 0.3;
          // Respawn traffic when out of canvas
          if (t.y > 500) {
            t.y = -150 - Math.random() * 200;
            t.x = [105, 185, 260][Math.floor(Math.random() * 3)];
          }

          // Collision detection
          if (
            sim.carX < t.x + t.width &&
            sim.carX + sim.carWidth > t.x &&
            sim.carY < t.y + t.height &&
            sim.carY + sim.carHeight > t.y
          ) {
            addViolation('Traffic Collision! Maintain safe following distance');
            sim.speed = Math.max(5, sim.speed - 15);
          }
        });

        // Target victory / game completion at 1500m
        if (sim.distance >= 1500) {
          setGameState('gameOver');
          const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
          localStorage.setItem('rto_user_xp', String(currentXp + 200));
        }

        setSpeed(Math.round(sim.speed));
        setSpeedLimit(sim.speedLimit);
        setDistance(sim.distance);
      }

      // RENDER CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Road background
      ctx.fillStyle = '#64748b'; // Shoulder
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1e293b'; // Main Asphalt Road
      ctx.fillRect(80, 0, 240, canvas.height);

      // Road Edges
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(80, 0, 4, canvas.height);
      ctx.fillRect(316, 0, 4, canvas.height);

      // 2. Dashed Lane dividers (3 lanes: lane 1 = 80-160, lane 2 = 160-240, lane 3 = 240-320)
      ctx.fillStyle = '#fde047';
      for (let y = -40 + sim.roadOffset; y < canvas.height; y += 40) {
        ctx.fillRect(160, y, 4, 20);
        ctx.fillRect(240, y, 4, 20);
      }

      // School Zone warning strip if in school zone
      if (sim.speedLimit === 30) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(80, 0, 240, canvas.height);
        ctx.fillStyle = '#fef2f2';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('🏫 SCHOOL ZONE — 30 KM/H LIMIT', 100, 30);
      }

      // 3. Traffic vehicles
      sim.traffic.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.roundRect(t.x, t.y, t.width, t.height, 4);
        ctx.fill();

        // Windshields
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(t.x + 3, t.y + 10, t.width - 6, 12);
        // Headlights / Taillights
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(t.x + 3, t.y + t.height - 4, 6, 3);
        ctx.fillRect(t.x + t.width - 9, t.y + t.height - 4, 6, 3);
      });

      // 4. Player Vehicle
      ctx.fillStyle = '#10b981'; // Green eco-car
      ctx.beginPath();
      ctx.roundRect(sim.carX, sim.carY, sim.carWidth, sim.carHeight, 6);
      ctx.fill();

      // Windshield & Roof
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sim.carX + 4, sim.carY + 14, sim.carWidth - 8, 14);
      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sim.carX + 4, sim.carY, 6, 4);
      ctx.fillRect(sim.carX + sim.carWidth - 10, sim.carY, 6, 4);
      // Taillights
      ctx.fillStyle = sim.keys.down ? '#ef4444' : '#991b1b';
      ctx.fillRect(sim.carX + 4, sim.carY + sim.carHeight - 4, 6, 3);
      ctx.fillRect(sim.carX + sim.carWidth - 10, sim.carY + sim.carHeight - 4, 6, 3);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          🚗 Game 4: 2D Safe Driving Simulator
        </span>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {/* Telemetry Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          background: 'var(--navy-900)',
          color: '#ffffff',
          padding: '1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Speed</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: speed > speedLimit ? 'var(--transport-red)' : '#ffffff' }}>
              {speed} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km/h</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Speed Limit</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {speedLimit} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km/h</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Safety Score</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: safetyScore >= 70 ? 'var(--success)' : 'var(--transport-red)' }}>
              {safetyScore} / 100
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Distance</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
              {distance} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/ 1500m</span>
            </div>
          </div>
        </div>

        {/* Canvas & Controls Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '400px', height: '480px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: '#1e293b' }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={480}
              style={{ display: 'block', width: '100%', height: '100%' }}
            />

            {/* Overlay if Idle or Game Over */}
            {gameState !== 'playing' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                color: '#ffffff'
              }}>
                {gameState === 'idle' && (
                  <>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      2D Safe Driving Simulator
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Drive 1,500m without speeding, colliding, or violating school zone rules. Use <strong>Arrow Keys</strong> or <strong>WASD</strong>.
                    </p>
                    <button onClick={startGame} className="btn btn-primary btn-lg" style={{ background: 'var(--transport-red)', border: 'none' }}>
                      Start Driving Sim
                    </button>
                  </>
                )}

                {gameState === 'gameOver' && (
                  <>
                    <Award size={48} color="var(--accent-gold)" style={{ marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      Route Completed!
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: safetyScore >= 70 ? 'var(--success)' : 'var(--transport-red)', fontWeight: 700, marginBottom: '1rem' }}>
                      Final Safety Score: {safetyScore} / 100 ({safetyScore >= 70 ? 'Passed Safe Driving Standard' : 'Disqualified for Violations'})
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={startGame} className="btn btn-secondary btn-sm">
                        <RotateCcw size={14} /> Retry Simulator
                      </button>
                      <Link to="/road-safety/ll-test" className="btn btn-primary btn-sm" style={{ background: 'var(--transport-red)', border: 'none' }}>
                        Mock LL Exam →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Onscreen Mobile Touch Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              onMouseDown={() => { simRef.current.keys.left = true; }}
              onMouseUp={() => { simRef.current.keys.left = false; }}
              onTouchStart={() => { simRef.current.keys.left = true; }}
              onTouchEnd={() => { simRef.current.keys.left = false; }}
              className="btn btn-secondary"
              style={{ width: '60px', height: '48px', fontSize: '1.2rem', fontWeight: 800 }}
            >
              ◀
            </button>
            <button
              type="button"
              onMouseDown={() => { simRef.current.keys.up = true; }}
              onMouseUp={() => { simRef.current.keys.up = false; }}
              onTouchStart={() => { simRef.current.keys.up = true; }}
              onTouchEnd={() => { simRef.current.keys.up = false; }}
              className="btn btn-primary"
              style={{ width: '80px', height: '48px', fontWeight: 700, background: 'var(--success)' }}
            >
              Gas ▲
            </button>
            <button
              type="button"
              onMouseDown={() => { simRef.current.keys.down = true; }}
              onMouseUp={() => { simRef.current.keys.down = false; }}
              onTouchStart={() => { simRef.current.keys.down = true; }}
              onTouchEnd={() => { simRef.current.keys.down = false; }}
              className="btn btn-secondary"
              style={{ width: '80px', height: '48px', fontWeight: 700, background: 'var(--transport-red)', color: '#fff' }}
            >
              Brake ▼
            </button>
            <button
              type="button"
              onMouseDown={() => { simRef.current.keys.right = true; }}
              onMouseUp={() => { simRef.current.keys.right = false; }}
              onTouchStart={() => { simRef.current.keys.right = true; }}
              onTouchEnd={() => { simRef.current.keys.right = false; }}
              className="btn btn-secondary"
              style={{ width: '60px', height: '48px', fontSize: '1.2rem', fontWeight: 800 }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Real-time Violations List */}
        {violations.length > 0 && (
          <div style={{ marginTop: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--transport-red)', display: 'block', marginBottom: '0.4rem' }}>
              Detected Traffic Infractions (-15 pts each):
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.78rem', color: '#991b1b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {violations.map((v, idx) => (
                <li key={idx}>⚠️ {v}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
