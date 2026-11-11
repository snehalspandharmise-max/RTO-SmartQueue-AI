import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { LL_QUESTIONS } from '../../data/portalData';

export function RoadSafetyQuiz() {
  const [questions] = useState(() => [...LL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const current = questions[currentIndex];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (idx === current.correct) {
      setScore(prev => prev + 1);
      const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
      localStorage.setItem('rto_user_xp', String(currentXp + 20));
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
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
          ⏱️ Game 5: Road Safety Quiz
        </span>
      </div>

      {!showResult ? (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
              Score: {score} / {questions.length}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            {current.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {current.options.map((opt, idx) => {
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
                  <span>{opt}</span>
                  {answered && isCorrect && <CheckCircle2 size={18} color="var(--success)" />}
                  {answered && isSelected && !isCorrect && <XCircle size={18} color="var(--transport-red)" />}
                </button>
              );
            })}
          </div>

          {/* Explanation on answer */}
          {answered && (
            <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--accent-gold)', padding: '1rem 1.25rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
                Legal Justification:
              </strong>
              <p style={{ fontSize: '0.825rem', color: 'var(--navy-800)', lineHeight: 1.5, margin: 0 }}>
                {current.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          {answered && (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {currentIndex + 1 < questions.length ? 'Next Question' : 'View Quiz Results'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      ) : (
        /* Result Summary */
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: score >= 7 ? '#f0fdf4' : '#fef2f2',
            color: score >= 7 ? 'var(--success)' : 'var(--transport-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Award size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Quiz Completed!
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You scored <strong>{score} out of 10</strong> ({score * 10}%)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={restart} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={15} /> Retake Quiz
            </button>
            <Link to="/road-safety/ll-test" className="btn btn-primary" style={{ background: 'var(--transport-red)', border: 'none' }}>
              Take 15-Question LL Mock Test →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
