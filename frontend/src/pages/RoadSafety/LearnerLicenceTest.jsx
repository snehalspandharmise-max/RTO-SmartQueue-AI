import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { LL_QUESTIONS } from '../../data/portalData';

export function LearnerLicenceTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Initialize 15 questions
  useEffect(() => {
    // If LL_QUESTIONS has at least 15, take 15, or duplicate slightly if fewer
    let pool = [...LL_QUESTIONS];
    while (pool.length < 15) {
      pool = [...pool, ...LL_QUESTIONS];
    }
    setQuestions(pool.slice(0, 15));
  }, []);

  // 30-second per question timer
  useEffect(() => {
    let timer;
    if (isTestActive && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTestActive && !isCompleted && timeLeft === 0) {
      // Auto-submit unanswered question when time runs out
      handleConfirmAnswer(null);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isCompleted, timeLeft]);

  const startTest = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(30);
    setUserAnswers([]);
    setIsCompleted(false);
    setIsTestActive(true);
  };

  const handleConfirmAnswer = (chosen = selectedOption) => {
    const currentQ = questions[currentIndex];
    const isCorrect = chosen === currentQ.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const record = {
      question: currentQ.question,
      chosen,
      correct: currentQ.correct,
      isCorrect,
      explanation: currentQ.explanation
    };
    const nextAnswers = [...userAnswers, record];
    setUserAnswers(nextAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setIsCompleted(true);
      setIsTestActive(false);

      // Save pass result in localStorage
      const passed = newScore >= 9;
      if (passed) {
        localStorage.setItem('rto_ll_passed', 'true');
        localStorage.setItem('rto_ll_score', String(newScore));
        const currentXp = parseInt(localStorage.getItem('rto_user_xp') || '250', 10);
        localStorage.setItem('rto_user_xp', String(currentXp + 250));
      }
    }
  };

  const currentQ = questions[currentIndex];
  const passed = score >= 9;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          📝 Sarathi 4.0 Mock Examination
        </span>
      </div>

      {/* Intro Card */}
      {!isTestActive && !isCompleted && (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef3c7',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
            Maharashtra Learner's Licence (LL) Mock Test
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            This test mirrors the computerized testing format used at Regional Transport Offices across Maharashtra.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem', textAlign: 'left' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Questions</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>15 Questions</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Timer Per Question</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>30 Seconds</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Passing Criteria</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>9 / 15 (60%)</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Credential Reward</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>Verifiable Certificate</strong>
            </div>
          </div>

          <button onClick={startTest} className="btn btn-primary btn-lg" style={{ background: 'var(--transport-red)', border: 'none', padding: '0.85rem 2.5rem' }}>
            Begin Official Mock Exam
          </button>
        </div>
      )}

      {/* Active Exam Card */}
      {isTestActive && currentQ && (
        <div className="card" style={{ padding: '2.25rem' }}>
          
          {/* Top Status Bar: Question Counter + Per-Question Countdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: timeLeft <= 10 ? '#fee2e2' : '#f1f5f9',
              color: timeLeft <= 10 ? 'var(--transport-red)' : 'var(--navy-900)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Clock size={16} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          {/* Progress Indicator */}
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--transport-red)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.35, marginBottom: '1.75rem' }}>
            {currentQ.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            {currentQ.options.map((option, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '8px',
                  border: selectedOption === idx ? '2px solid var(--primary-teal)' : '2px solid #e2e8f0',
                  background: selectedOption === idx ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  fontWeight: selectedOption === idx ? 700 : 500,
                  color: 'var(--navy-900)',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="radio"
                  name="ll_option"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                  style={{ accentColor: 'var(--primary-teal)', width: '18px', height: '18px' }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {/* Submit Choice Button */}
          <button
            type="button"
            onClick={() => handleConfirmAnswer(selectedOption)}
            disabled={selectedOption === null}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            Confirm Answer & Next <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Results Card */}
      {isCompleted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: passed ? '5px solid var(--success)' : '5px solid var(--transport-red)' }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: passed ? '#f0fdf4' : '#fef2f2',
              color: passed ? 'var(--success)' : 'var(--transport-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              {passed ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              {passed ? 'Congratulations! You Passed the LL Mock Exam' : 'Test Not Cleared — Review & Try Again'}
            </h2>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Final Result: <strong>{score} out of 15 correct</strong> ({Math.round((score / 15) * 100)}%) — Required: 9/15
            </p>

            <div style={{ display: 'inline-flex', gap: '1.5rem', background: '#f8fafc', padding: '1rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Status</span>
                <strong style={{ fontSize: '1.1rem', color: passed ? 'var(--success)' : 'var(--transport-red)' }}>
                  {passed ? 'QUALIFIED' : 'UNSUCCESSFUL'}
                </strong>
              </div>
              <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>XP Earned</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                  +{score * 20} XP
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={startTest} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <RotateCcw size={15} /> Retake Test
              </button>
              {passed && (
                <Link to="/road-safety/certificate" className="btn btn-primary" style={{ background: 'var(--accent-gold)', color: 'var(--navy-900)', fontWeight: 700, border: 'none' }}>
                  🎓 Generate Road Safety Certificate →
                </Link>
              )}
            </div>
          </div>

          {/* Detailed Question Review Accordion */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
              Question-by-Question Diagnostic Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userAnswers.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${item.isCorrect ? 'var(--success)' : 'var(--transport-red)'}`,
                    background: item.isCorrect ? '#f0fdf4' : '#fef2f2'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--navy-900)' }}>
                      Q{idx + 1}: {item.question}
                    </strong>
                    <span className={`badge ${item.isCorrect ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.68rem' }}>
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.35rem 0' }}>
                    <strong>Legal Rule:</strong> {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
