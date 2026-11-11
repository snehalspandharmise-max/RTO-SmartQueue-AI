import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowLeft, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { ROAD_SIGNS } from '../../data/portalData';

export function RoadSignChallenge() {
  const [currentLevel, setCurrentLevel] = useState('all'); // all, Mandatory, Cautionary, Informatory
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const signs = currentLevel === 'all'
    ? ROAD_SIGNS
    : ROAD_SIGNS.filter(s => s.category === currentLevel);

  const currentSign = signs[currentIndex] || signs[0];

  // Generate 4 randomized options (1 correct + 3 distractor signs)
  const options = React.useMemo(() => {
    if (!currentSign) return [];
    const others = ROAD_SIGNS.filter(s => s.id !== currentSign.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const pool = [currentSign, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return pool;
  }, [currentSign]);

  const handleSelect = (sign) => {
    if (answered) return;
    setSelectedOption(sign.id);
    setAnswered(true);

    if (sign.id === currentSign.id) {
      setScore(prev => prev + 1);
      // Award XP
      const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
      localStorage.setItem('rto_user_xp', String(currentXp + 20));
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < signs.length) {
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
      
      {/* Navigation & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          🛑 Game 1: Road Sign Challenge
        </span>
      </div>

      {!showResult ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)' }}>
              Sign {currentIndex + 1} of {signs.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
              Score: {score} / {signs.length}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${((currentIndex + 1) / signs.length) * 100}%`, height: '100%', background: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Road Sign Graphic Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: currentSign.shape === 'Octagon' ? '20%' : currentSign.shape === 'Triangle' ? '12px' : currentSign.shape === 'Rectangle' ? '8px' : '50%',
              border: `6px solid ${currentSign.color === 'Blue' ? '#1d4ed8' : '#dc2626'}`,
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              marginBottom: '1rem',
              textAlign: 'center',
              padding: '0.5rem'
            }}>
              <span style={{ fontSize: '2.2rem' }}>{currentSign.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                {currentSign.shape}
              </span>
            </div>

            <span className={`badge ${currentSign.category === 'Mandatory' ? 'badge-error' : currentSign.category === 'Cautionary' ? 'badge-warning' : 'badge-teal'}`}>
              Category: {currentSign.category} Sign
            </span>
          </div>

          {/* 4 Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentSign.id;
              let btnStyle = {
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                background: '#ffffff',
                textAlign: 'left',
                cursor: answered ? 'default' : 'pointer',
                fontWeight: 600,
                fontSize: '0.92rem',
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
                } else if (isSelected) {
                  btnStyle.borderColor = 'var(--transport-red)';
                  btnStyle.background = '#fef2f2';
                  btnStyle.color = '#991b1b';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                  style={btnStyle}
                >
                  <span>{opt.name}</span>
                  {answered && isCorrect && <CheckCircle2 size={18} color="var(--success)" />}
                  {answered && isSelected && !isCorrect && <XCircle size={18} color="var(--transport-red)" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {answered && (
            <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--accent-gold)', padding: '1rem 1.25rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
                Explanation & Legal Rule:
              </strong>
              <p style={{ fontSize: '0.825rem', color: 'var(--navy-800)', lineHeight: 1.5, margin: 0, marginBottom: '0.4rem' }}>
                {currentSign.meaning}
              </p>
              {currentSign.fine && (
                <span style={{ fontSize: '0.78rem', color: 'var(--transport-red)', fontWeight: 700 }}>
                  ⚖️ Violation Fine (MVA): {currentSign.fine}
                </span>
              )}
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
              {currentIndex + 1 < signs.length ? 'Next Road Sign' : 'View Challenge Summary'} <ArrowRight size={16} />
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
            background: score >= signs.length * 0.7 ? '#f0fdf4' : '#fef2f2',
            color: score >= signs.length * 0.7 ? 'var(--success)' : 'var(--transport-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Award size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Challenge Completed!
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You scored <strong>{score} out of {signs.length}</strong> ({Math.round((score / signs.length) * 100)}%)
          </p>

          <div style={{ display: 'inline-flex', gap: '1rem', background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>XP Earned</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>+{score * 20} XP</strong>
            </div>
            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Proficiency</span>
              <strong style={{ fontSize: '1.1rem', color: score >= signs.length * 0.7 ? 'var(--success)' : 'var(--transport-red)' }}>
                {score >= signs.length * 0.7 ? 'Mastered' : 'Needs Practice'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={restart} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={15} /> Play Again
            </button>
            <Link to="/road-safety/ll-test" className="btn btn-primary" style={{ background: 'var(--transport-red)', border: 'none' }}>
              Take Full Mock LL Test →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
