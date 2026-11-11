import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export function TrafficSignalMaster() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const signalScenarios = [
    {
      id: 'red',
      lightState: 'red',
      title: 'Solid Red Light at 4-Way Junction',
      question: 'You are driving towards a 4-way intersection and the traffic signal turns solid red. What is the mandatory legal action?',
      options: [
        'Stop completely behind the white stop line or zebra crossing and wait for green.',
        'Slow down to 10 km/h and cross if no traffic is coming from the right.',
        'Honk continuously and turn left immediately without stopping.',
        'Proceed cautiously behind an auto-rickshaw.'
      ],
      correct: 0,
      rule: 'Section 119 MVA: Mandatory stop behind stop line. Fine: ₹1,000 + 3-month licence suspension for repeat offenses.'
    },
    {
      id: 'amber',
      lightState: 'yellow',
      title: 'Solid Amber / Yellow Light Transition',
      question: 'The signal switches from Green to Amber as you are 15 meters away driving at 40 km/h. What does the law require?',
      options: [
        'Accelerate rapidly to cross before the red light triggers.',
        'Stop safely before the stop line unless you are too close to stop safely without risking a rear-end collision.',
        'Come to an abrupt halt regardless of vehicles immediately tailgating behind you.',
        'Turn your hazard blinkers on and proceed.'
      ],
      correct: 1,
      rule: 'Yellow signals warn that red is imminent. You must stop unless stopping abruptly would endanger vehicles behind you.'
    },
    {
      id: 'green',
      lightState: 'green',
      title: 'Solid Green Light with Congested Junction',
      question: 'The signal turns Green, but the intersection ahead is blocked with gridlocked vehicles. What should you do?',
      options: [
        'Drive in immediately and block the pedestrian crosswalk.',
        'Hold behind the stop line and do not enter the junction until there is clear space on the other side (Yellow Box rule).',
        'Squeeze your vehicle through the gap between oncoming two-wheelers.',
        'Honk until the traffic in front clears out.'
      ],
      correct: 1,
      rule: 'Yellow Box Junction Rule: Never enter an intersection unless your exit is clear, even on green.'
    },
    {
      id: 'flashing-red',
      lightState: 'flashing-red',
      title: 'Flashing Red Signal at Late Night Intersection',
      question: 'At 11:30 PM, an intersection signal is flashing red. What is your legal obligation?',
      options: [
        'Ignore it because traffic signals do not apply after 11 PM.',
        'Treat it exactly like a Stop sign: bring vehicle to a complete stop, yield to all cross-traffic and pedestrians, and proceed only when clear.',
        'Drive through at normal speed while flashing headlights.',
        'Honk twice and maintain current speed.'
      ],
      correct: 1,
      rule: 'Flashing Red = Mandatory STOP sign. Full wheel stop required before proceeding when safe.'
    },
    {
      id: 'flashing-yellow',
      lightState: 'flashing-yellow',
      title: 'Flashing Amber / Yellow Signal',
      question: 'You approach a roundabout displaying a flashing amber signal. How should you navigate this intersection?',
      options: [
        'Maintain highway speed since it indicates right of way.',
        'Slow down significantly, proceed with caution, and yield right of way to vehicles already inside or approaching from the right.',
        'Stop for a minimum of 2 minutes before proceeding.',
        'Overtake any heavy vehicle on the left.'
      ],
      correct: 1,
      rule: 'Flashing Yellow indicates caution. Slow down, check both sides, and give way to traffic on the main carriageway.'
    },
    {
      id: 'green-arrow',
      lightState: 'green-arrow',
      title: 'Green Arrow with Red Main Signal',
      question: 'The main circular signal is RED, but an illuminated GREEN ARROW points to the right. What can you do?',
      options: [
        'You cannot move in any direction until the main signal turns green.',
        'You may turn right cautiously in the direction of the arrow while yielding to pedestrians.',
        'You may proceed straight or make a U-turn.',
        'You must wait for a police officer to manually signal.'
      ],
      correct: 1,
      rule: 'Filter Green Arrow permits turning in that specific direction even when general movement is halted by red.'
    }
  ];

  const current = signalScenarios[currentIndex];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (idx === current.correct) {
      setScore(prev => prev + 1);
      const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
      localStorage.setItem('rto_user_xp', String(currentXp + 25));
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < signalScenarios.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          🚦 Game 2: Traffic Signal Master
        </span>
      </div>

      {!showResult ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Progress & Score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)' }}>
              Scenario {currentIndex + 1} of {signalScenarios.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
              Score: {score} / {signalScenarios.length}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${((currentIndex + 1) / signalScenarios.length) * 100}%`, height: '100%', background: 'var(--primary-teal)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Traffic Light Graphic Simulator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            background: '#1e293b',
            borderRadius: '12px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            {/* Realistic Signal Housing */}
            <div style={{
              width: '64px',
              background: '#0f172a',
              borderRadius: '24px',
              padding: '12px 10px',
              border: '3px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
            }}>
              {/* Red Light */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: current.lightState.includes('red') ? '#ef4444' : '#450a0a',
                boxShadow: current.lightState.includes('red') ? '0 0 16px #ef4444' : 'none',
                transition: 'all 0.2s ease'
              }} />
              {/* Yellow Light */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: current.lightState.includes('yellow') ? '#eab308' : '#422006',
                boxShadow: current.lightState.includes('yellow') ? '0 0 16px #eab308' : 'none',
                transition: 'all 0.2s ease'
              }} />
              {/* Green Light */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: current.lightState.includes('green') ? '#22c55e' : '#052e16',
                boxShadow: current.lightState.includes('green') ? '0 0 16px #22c55e' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: 800,
                transition: 'all 0.2s ease'
              }}>
                {current.lightState === 'green-arrow' ? '➔' : ''}
              </div>
            </div>

            <div style={{ color: '#ffffff' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', marginBottom: '0.4rem' }}>
                Active Signal State
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, marginBottom: '0.35rem' }}>
                {current.title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Observe the signal and junction configuration carefully.
              </span>
            </div>
          </div>

          {/* Question */}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
            {current.question}
          </h4>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {current.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === current.correct;
              let btnStyle = {
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                background: '#ffffff',
                textAlign: 'left',
                cursor: answered ? 'default' : 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: 'var(--navy-900)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              };

              if (answered) {
                if (isCorrect) {
                  btnStyle.borderColor = 'var(--success)';
                  btnStyle.background = '#f0fdf4';
                  btnStyle.color = '#166534';
                  btnStyle.fontWeight = 700;
                } else if (isSelected) {
                  btnStyle.borderColor = 'var(--transport-red)';
                  btnStyle.background = '#fef2f2';
                  btnStyle.color = '#991b1b';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  style={btnStyle}
                >
                  <span>{option}</span>
                  {answered && isCorrect && <CheckCircle2 size={18} color="var(--success)" />}
                  {answered && isSelected && !isCorrect && <XCircle size={18} color="var(--transport-red)" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {answered && (
            <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary-teal)', padding: '1rem 1.25rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
                Traffic Rule & MVA Precedent:
              </strong>
              <p style={{ fontSize: '0.825rem', color: 'var(--navy-800)', lineHeight: 1.5, margin: 0 }}>
                {current.rule}
              </p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {currentIndex + 1 < signalScenarios.length ? 'Next Signal Scenario' : 'View Master Score'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: score >= 4 ? '#f0fdf4' : '#fef2f2',
            color: score >= 4 ? 'var(--success)' : 'var(--transport-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Award size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Signal Master Certification Complete!
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You scored <strong>{score} out of {signalScenarios.length}</strong> ({Math.round((score / signalScenarios.length) * 100)}%)
          </p>

          <div style={{ display: 'inline-flex', gap: '1rem', background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>XP Earned</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>+{score * 25} XP</strong>
            </div>
            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Intersection Rating</span>
              <strong style={{ fontSize: '1.1rem', color: score >= 4 ? 'var(--success)' : 'var(--transport-red)' }}>
                {score >= 4 ? 'Intersection Expert' : 'Review Rules'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={restart} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={15} /> Play Again
            </button>
            <Link to="/road-safety/spot-hazard" className="btn btn-primary" style={{ background: 'var(--transport-red)', border: 'none' }}>
              Play Game 3: Spot Road Hazard →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
