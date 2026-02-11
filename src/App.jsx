import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Globe, Cpu, FileText, ArrowRight, Loader2, Link as LinkIcon, Calendar, Info, Activity, Zap, TrendingUp, Radar } from 'lucide-react';
import { scoutCompetitor } from './services/scoutService';

const steps = [
  { id: 0, label: 'SCANNING', icon: Radar, color: 'var(--accent-cyan)' },
  { id: 1, label: 'SCRAPING', icon: Globe, color: '#4cc9f0' },
  { id: 2, label: 'VERIFYING', icon: ShieldCheck, color: '#4895ef' },
  { id: 3, label: 'SYNTHESIZING', icon: Cpu, color: 'var(--accent-magenta)' }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle'); // idle, searching, reporting
  const [currentStep, setCurrentStep] = useState(-1);
  const [brief, setBrief] = useState(null);
  const [tickerText, setTickerText] = useState('READY TO SCOUT');

  useEffect(() => {
    const messages = [
      "MONITORING GLOBAL MARKETS",
      "AI AGENTS ACTIVE",
      "SEARCHING FOR EDGE CASES",
      "SYNTHESIZING LIVE FEEDS",
      "ENCRYPTED TUNNEL ESTABLISHED"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTickerText(messages[i % messages.length]);
      i++;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setStatus('searching');
    setBrief(null);

    const result = await scoutCompetitor(query, (step) => {
      setCurrentStep(step);
    });

    setBrief(result);
    setStatus('reporting');
    setCurrentStep(-1);
  };

  return (
    <div className="app-container" style={{ padding: '0', maxWidth: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="scanline"></div>

      {/* Top Navbar / Ticker */}
      <nav className="glass" style={{
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-cyan)', width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent-cyan)' }}>LIVE_FEED:</span>
          <span style={{ fontSize: '0.8rem', color: 'white', opacity: 0.8, letterSpacing: '1px' }}>{tickerText}</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>
          <span>v2.0.4-LIVE</span>
          <span>SECURE_NODE_7</span>
        </div>
      </nav>

      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,242,255,0.1)', border: '1px solid rgba(0,242,255,0.2)' }}
          >
            <Activity size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>SYSTEM OPERATIONAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyan-gradient"
            style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-2px' }}
          >
            MARKET SCOUT
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', opacity: 0.7 }}>
            Next-generation competitive intelligence for technical founders.
          </p>
        </header>

        {/* Search Input */}
        <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%', maxWidth: '700px' }}>
            <div className="border-glow" style={{ borderRadius: '16px' }}>
              <input
                type="text"
                placeholder="Enter company or product name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={status === 'searching'}
                className="glass"
                style={{
                  width: '100%',
                  padding: '1.5rem 2rem',
                  borderRadius: '16px',
                  fontSize: '1.25rem',
                  color: 'white',
                  outline: 'none',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'searching'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--accent-cyan)',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                color: 'black',
                transition: 'all 0.2s',
                opacity: status === 'searching' ? 0.5 : 1
              }}
            >
              <Search size={20} />
              <span>SCOUT</span>
            </button>
          </form>
        </section>

        {/* Progress Timeline */}
        <AnimatePresence>
          {status === 'searching' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass"
              style={{
                padding: '4rem 2rem',
                borderRadius: '24px',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 0
              }} />

              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === idx;
                const isCompleted = currentStep > idx;

                return (
                  <div key={idx} style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                    <motion.div
                      animate={{
                        scale: isActive ? 1.25 : 1,
                        backgroundColor: isCompleted ? step.color : (isActive ? 'rgba(255,255,255,0.05)' : 'transparent'),
                        borderColor: isActive ? step.color : 'rgba(255,255,255,0.1)'
                      }}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid`,
                        marginBottom: '1.2rem',
                        color: isCompleted ? 'black' : (isActive ? step.color : 'rgba(255,255,255,0.3)'),
                        boxShadow: isActive ? `0 0 30px ${step.color}44` : 'none'
                      }}
                    >
                      {isActive ? <Loader2 className="animate-spin" size={28} /> : <Icon size={28} />}
                    </motion.div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      letterSpacing: '1.5px',
                      color: isActive ? step.color : 'var(--text-secondary)',
                      opacity: isActive || isCompleted ? 1 : 0.4
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intelligence Brief */}
        <AnimatePresence>
          {status === 'reporting' && brief && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <Radar size={18} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '2px' }}>REPORT_GEN_04</span>
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>{brief.company} BRIEF</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>WINDOW: {brief.dateRange}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-magenta)', fontWeight: 'bold' }}>FETCHED: {brief.timestamp}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: brief.features.length > 0 ? 'repeat(auto-fill, minmax(500px, 1fr))' : '1fr', gap: '2rem' }}>
                {brief.features.length > 0 ? (
                  brief.features.map((f, i) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="glass glass-interactive"
                      style={{ padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
                          <Zap size={20} color="var(--accent-cyan)" />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          {f.source}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: '700', lineHeight: 1.3 }}>{f.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', flexGrow: 1 }}>{f.description}</p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-magenta)' }}>{f.date}</span>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '6px' }}
                        >
                          VIEW SOURCE <ArrowRight size={14} />
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass"
                    style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center' }}
                  >
                    <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                      <Search size={40} color="var(--text-secondary)" opacity={0.3} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Intelligence Found</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                      {brief.error || "Our agents couldn't find any significant technical updates for this query in the last 7 days."}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Key Hint */}
        {!(import.meta.env.VITE_SERPER_API_KEY) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass"
            style={{
              marginTop: '4rem',
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 193, 7, 0.1)'
            }}
          >
            <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '10px', borderRadius: '50%' }}>
              <Info size={20} color="#ffc107" />
            </div>
            <div>
              <strong style={{ color: 'white', display: 'block', marginBottom: '2px' }}>Live Search Disabled</strong>
              <span>Demo Mode active. To enable live web searching, add <code>VITE_SERPER_API_KEY</code> to your <code>.env</code> file.</span>
            </div>
          </motion.div>
        )}
      </main>

      <footer style={{ marginTop: 'auto', padding: '4rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.5 }}>© 2026 MARKET SCOUT INTELLIGENCE SYSTEMS</p>
      </footer>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          h1 { font-size: 3rem !important; }
          .glass-interactive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
