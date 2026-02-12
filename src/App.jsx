import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Globe, Cpu, FileText, ArrowRight, Loader2, Link as LinkIcon, Calendar, Info, Activity, Zap, TrendingUp, Radar, Github, MessageSquare, Twitter, Briefcase, Share2, Rocket, Download, History as HistoryIcon, Bell, Settings, Share, Upload } from 'lucide-react';
import { scoutMultipleCompetitors, sendToWebhook, analyzeTriggers } from './services/scoutService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const steps = [
  { id: 0, label: 'SCAN_KEY', icon: Radar, color: 'var(--accent-cyan)' },
  { id: 1, label: 'SCRAPE_KEY', icon: Globe, color: '#4cc9f0' },
  { id: 2, label: 'VERIFY_KEY', icon: ShieldCheck, color: '#4895ef' },
  { id: 3, label: 'SYNTH_KEY', icon: Cpu, color: 'var(--accent-magenta)' }
];

const SOURCE_MAP = {
  GENERAL: { icon: Globe, color: 'var(--accent-cyan)' },
  GITHUB: { icon: Github, color: '#a855f7' },
  SOCIAL: { icon: MessageSquare, color: '#f97316' },
  HIRING: { icon: Briefcase, color: '#3b82f6' },
  RELEASES: { icon: Rocket, color: 'var(--accent-magenta)' }
};

const TRANSLATIONS = {
  en: {
    ticker: "READY TO SCOUT",
    operational: "SYSTEM OPERATIONAL",
    title: "MARKET SCOUT",
    tagline: "Next-generation competitive intelligence for technical founders.",
    placeholder: "Enter company names (e.g., Apple, Microsoft, Vercel)...",
    scout: "SCOUT",
    comparison: "INTELLIGENCE COMPARISON",
    sentiment: "SENTIMENT",
    strength: "STRENGTH",
    weakness: "WEAKNESS",
    opportunity: "OPPORTUNITY",
    threat: "THREAT",
    source: "SOURCE",
    no_results: "No verified updates found",
    SCAN_KEY: "SCANNING",
    SCRAPE_KEY: "SCRAPING",
    VERIFY_KEY: "VERIFYING",
    SYNTH_KEY: "SYNTHESIZING",
    GITHUB_PULSE: "GITHUB PULSE",
    HIRING_SIGNAL: "HIRING SIGNAL",
    NEW_RELEASE: "NEW RELEASE",
    EXPORT_REPORT: "EXPORT REPORT (PDF)",
    HISTORY: "HISTORY",
    TIMELINE: "INTELLIGENCE TIMELINE",
    SETTINGS: "SETTINGS",
    ALERTS: "SMART ALERTS",
    WEBHOOK_URL: "SLACK/DISCORD WEBHOOK URL",
    EXPORT_HISTORY: "EXPORT DATA (JSON)",
    IMPORT_HISTORY: "IMPORT DATA (JSON)",
    CLEAR_HISTORY: "CLEAR HISTORY",
    CONNECT: "CONNECT",
    CONNECTED: "CONNECTED"
  },
  es: {
    ticker: "LISTO PARA EXPLORAR",
    operational: "SISTEMA OPERATIVO",
    title: "EXPLORADOR",
    tagline: "Inteligencia competitiva de próxima generación para fundadores.",
    placeholder: "Ingrese nombres de empresas...",
    scout: "EXPLORAR",
    comparison: "COMPARACIÓN DE INTELIGENCIA",
    sentiment: "SENTIMIENTO",
    strength: "FORTALEZA",
    weakness: "DEBILIDAD",
    opportunity: "OPORTUNIDAD",
    threat: "AMENAZA",
    source: "FUENTE",
    no_results: "No se encontraron actualizaciones",
    SCAN_KEY: "ESCANEO",
    SCRAPE_KEY: "RECOPILACIÓN",
    VERIFY_KEY: "VERIFICACIÓN",
    SYNTH_KEY: "SÍNTESIS",
    GITHUB_PULSE: "PULSO GITHUB",
    HIRING_SIGNAL: "SEÑAL DE EMPLEO",
    NEW_RELEASE: "NUEVO LANZAMIENTO",
    EXPORT_REPORT: "EXPORTAR INFORME (PDF)",
    HISTORY: "HISTORIAL",
    TIMELINE: "LÍNEA DE TIEMPO",
    SETTINGS: "CONFIGURACIÓN",
    ALERTS: "ALERTA INTELIGENTE",
    WEBHOOK_URL: "URL DE WEBHOOK DE SLACK/DISCORD",
    EXPORT_HISTORY: "EXPORTAR DATOS (JSON)",
    IMPORT_HISTORY: "IMPORTAR DATOS (JSON)",
    CLEAR_HISTORY: "BORRAR HISTORIAL",
    CONNECT: "CONECTAR",
    CONNECTED: "CONECTADO"
  },
  hi: {
    ticker: "खोज के लिए तैयार",
    operational: "सिस्टम सक्रिय",
    title: "मार्केट स्काउट",
    tagline: "संस्थापकों के लिए अगली पीढ़ी की प्रतिस्पर्धी खुफिया जानकारी।",
    placeholder: "कंपनियों के नाम दर्ज करें...",
    scout: "खोजें",
    comparison: "खुफिया तुलना",
    sentiment: "मार्केट सेंटीमेंट",
    strength: "शक्ति",
    weakness: "कमजोरी",
    opportunity: "अवसर",
    threat: "खतरा",
    source: "स्रोत",
    no_results: "कोई अपडेट नहीं मिला",
    SCAN_KEY: "स्कैनिंग",
    SCRAPE_KEY: "डाटा निष्कर्षण",
    VERIFY_KEY: "सत्यापन",
    SYNTH_KEY: "संश्लेषण",
    GITHUB_PULSE: "गिटहब गतिविधि",
    HIRING_SIGNAL: "भर्ती संकेत",
    NEW_RELEASE: "नई रिलीज़",
    EXPORT_REPORT: "रिपोर्ट निर्यात करें (PDF)",
    HISTORY: "इतिहास",
    TIMELINE: "इंटेलिजेंस टाइमलाइन",
    SETTINGS: "सेटिंग्स",
    ALERTS: "स्मार्ट अलर्ट",
    WEBHOOK_URL: "SLACK/DISCORD वेबहुक URL",
    EXPORT_HISTORY: "डेटा निर्यात करें (JSON)",
    IMPORT_HISTORY: "डेटा आयात करें (JSON)",
    CLEAR_HISTORY: "इतिहास साफ़ करें",
    CONNECT: "जोड़ें",
    CONNECTED: "जुड़ा हुआ",
    m1: "वैश्विक बाजारों की निगरानी",
    m2: "एआई एजेंट सक्रिय",
    m3: "खुफिया विश्लेषण"
  },
  fr: {
    ticker: "PRÊT À EXPLORER",
    operational: "SYSTÈME OPÉRATIONNEL",
    title: "SCOUT DU MARCHÉ",
    tagline: "Intelligence compétitive de nouvelle génération pour les fondateurs.",
    placeholder: "Entrez les noms des entreprises...",
    scout: "EXPLORER",
    comparison: "COMPARAISON D'INTELLIGENCE",
    sentiment: "SENTIMENT",
    strength: "FORCE",
    weakness: "FAIBLESSE",
    opportunity: "OPPORTUNITÉ",
    threat: "MENACE",
    source: "SOURCE",
    no_results: "Aucune mise à jour trouvée",
    SCAN_KEY: "BALAYAGE",
    SCRAPE_KEY: "RÉCUPÉRATION",
    VERIFY_KEY: "VÉRIFICATION",
    SYNTH_KEY: "SYNTHÈSE",
    GITHUB_PULSE: "PULSION GITHUB",
    HIRING_SIGNAL: "SIGNAL D'EMBAUCHE",
    NEW_RELEASE: "NOUVELLE SORTIE",
    EXPORT_REPORT: "EXPORTER LE RAPPORT (PDF)",
    HISTORY: "HISTORIQUE",
    TIMELINE: "LIGNE DU TEMPS",
    SETTINGS: "PARAMÈTRES",
    ALERTS: "ALERTES INTELLIGENTES",
    WEBHOOK_URL: "URL WEBHOOK SLACK/DISCORD",
    EXPORT_HISTORY: "EXPORTER DES DONNÉES (JSON)",
    IMPORT_HISTORY: "IMPORTER DES DONNÉES (JSON)",
    CLEAR_HISTORY: "EFFACER L'HISTORIQUE",
    CONNECT: "CONNECTER",
    CONNECTED: "CONNECTÉ",
    m1: "SURVEILLANCE DES MARCHÉS",
    m2: "AGENTS IA ACTIFS",
    m3: "ANALYSE STRATÉGIQUE"
  }
};

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle'); // idle, searching, reporting
  const [currentStep, setCurrentStep] = useState(-1);
  const [briefs, setBriefs] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('market_scout_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [lang, setLang] = useState('en');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('market_scout_webhook') || '');
  const [alerts, setAlerts] = useState([]);
  const [tickerText, setTickerText] = useState(TRANSLATIONS.en.ticker);

  const t = (key) => TRANSLATIONS[lang][key] || key;

  useEffect(() => {
    const messages = {
      en: ["MONITORING GLOBAL MARKETS", "AI AGENTS ACTIVE", "ENCRYPTED TUNNEL ESTABLISHED"],
      es: ["MONITOREO DE MERCADOS", "AGENTES IA ACTIVOS", "TÚNEL ENCRIPTADO"],
      hi: ["वैश्विक बाजारों की निगरानी", "एआई एजेंट सक्रिय", "सुरक्षित कनेक्शन"],
      fr: ["SURVEILLANCE DES MARCHÉS", "AGENTS IA ACTIFS", "TUNNEL CHIFFRÉ"]
    };
    let i = 0;
    const interval = setInterval(() => {
      setTickerText(messages[lang][i % messages[lang].length]);
      i++;
    }, 5000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setStatus('searching');
    setBriefs([]);

    const results = await scoutMultipleCompetitors(query, (step) => {
      setCurrentStep(step);
    });

    setBriefs(results);
    setStatus('reporting');
    setCurrentStep(-1);

    // Phase 6: Analyze Triggers & Sync
    const newAlerts = analyzeTriggers(results);
    setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));

    if (webhookUrl && results.length > 0) {
      sendToWebhook(webhookUrl, { query, briefs: results });
    }

    // Save to History
    if (results.length > 0) {
      const newEntry = {
        id: Date.now(),
        query,
        timestamp: new Date().toLocaleString(),
        competitors: results.map(b => b.company),
        briefs: results
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('market_scout_history', JSON.stringify(updatedHistory));
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('report-container');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0a0f'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`MarketScout_Report_${Date.now()}.pdf`);
  };

  const handleExportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `MarketScout_History_${Date.now()}.json`);
    linkElement.click();
  };

  const handleImportHistory = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const merged = [...imported, ...history].slice(0, 20);
        setHistory(merged);
        localStorage.setItem('market_scout_history', JSON.stringify(merged));
      } catch (err) {
        alert("Invalid history file.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all scouting history?")) {
      setHistory([]);
      localStorage.removeItem('market_scout_history');
    }
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
          <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--accent-cyan)' }}>FEED:</span>
          <span style={{ fontSize: '0.8rem', color: 'white', opacity: 0.8, letterSpacing: '1px' }}>{tickerText}</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            {['en', 'es', 'hi', 'fr'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? 'var(--accent-cyan)' : 'transparent',
                  color: lang === l ? 'black' : 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: showHistory ? 'var(--accent-magenta)' : 'rgba(255,255,255,0.05)',
              color: showHistory ? 'black' : 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.7rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <HistoryIcon size={14} />
            {t('HISTORY')}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: showSettings ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
              color: showSettings ? 'black' : 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.7rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Settings size={14} />
            {t('SETTINGS')}
          </button>

          <div style={{ position: 'relative' }}>
            <Bell size={18} color={alerts.length > 0 ? 'var(--accent-magenta)' : 'rgba(255,255,255,0.3)'} />
            {alerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-magenta)',
                color: 'black',
                fontSize: '0.6rem',
                fontWeight: '900',
                padding: '2px 5px',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--accent-magenta)'
              }}>{alerts.length}</span>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6, letterSpacing: '1px' }}>
            SECURE_NODE_7
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative' }}>
        {/* Phase 6: Smart Alert Center */}
        <div style={{ position: 'fixed', top: '80px', right: '2rem', zIndex: 90, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          <AnimatePresence>
            {alerts.map((alert, idx) => (
              <motion.div
                key={`${alert.company}-${idx}`}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(10,10,15,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alert.type === 'CRITICAL' ? 'var(--accent-magenta)' : 'var(--accent-blue)'}`,
                  padding: '1rem',
                  borderRadius: '12px',
                  width: '280px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ background: alert.type === 'CRITICAL' ? 'rgba(255,0,217,0.1)' : 'rgba(0,102,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                  <Bell size={16} color={alert.type === 'CRITICAL' ? 'var(--accent-magenta)' : 'var(--accent-blue)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '900', color: alert.type === 'CRITICAL' ? 'var(--accent-magenta)' : 'var(--accent-blue)', letterSpacing: '1px', marginBottom: '4px' }}>
                    {alert.type}_TRIGGER
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>{alert.company}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>{alert.msg}</div>
                </div>
                <button
                  onClick={() => setAlerts(prev => prev.filter((_, i) => i !== idx))}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.2rem' }}
                >×</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Header */}
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,242,255,0.1)', border: '1px solid rgba(0,242,255,0.2)' }}
          >
            <Activity size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>{t('operational')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyan-gradient float-animation"
            style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-2px', position: 'relative' }}
          >
            {t('title')}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              style={{ fontSize: '0.8rem', position: 'absolute', top: '10px', right: '-80px', background: 'var(--accent-magenta)', color: 'white', padding: '2px 8px', borderRadius: '4px', letterSpacing: '1px', boxShadow: '0 0 15px var(--accent-magenta)' }}
            >
              V3.0
            </motion.span>
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', opacity: 0.7 }}>
            {t('tagline')}
          </p>
        </header>

        {/* Search Input */}
        <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
          {/* Phase 6: Collaboration Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ marginBottom: '2rem' }}
              >
                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--accent-blue)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-blue)', letterSpacing: '2px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Share size={18} />
                      AUTOMATION_WEBHOOK
                    </h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        className="glass"
                        placeholder={t('WEBHOOK_URL')}
                        value={webhookUrl}
                        onChange={(e) => {
                          setWebhookUrl(e.target.value);
                          localStorage.setItem('market_scout_webhook', e.target.value);
                        }}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                      />
                      <button style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--accent-blue)', color: 'black', fontWeight: '900', border: 'none', cursor: 'pointer' }}>
                        {webhookUrl ? t('CONNECTED') : t('CONNECT')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Download size={18} />
                      DATA_PORTABILITY
                    </h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button
                        onClick={handleExportHistory}
                        className="glass glow-on-hover"
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                      >
                        <Download size={14} />
                        {t('EXPORT_HISTORY')}
                      </button>
                      <label className="glass glow-on-hover" style={{ flex: 1, padding: '12px', borderRadius: '12px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Upload size={14} />
                        {t('IMPORT_HISTORY')}
                        <input type="file" hidden onChange={handleImportHistory} accept=".json" />
                      </label>
                      <button
                        onClick={handleClearHistory}
                        className="glass"
                        style={{ padding: '12px', borderRadius: '12px', color: '#ff4d4d', fontWeight: 'bold', border: '1px solid rgba(255, 77, 77, 0.2)', background: 'rgba(255, 77, 77, 0.05)', cursor: 'pointer' }}
                      >
                        {t('CLEAR_HISTORY')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 4rem' }}>
            <div className="border-glow" style={{ borderRadius: '16px' }}>
              <input
                type="text"
                placeholder={t('placeholder')}
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
              <span>{t('scout')}</span>
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
                      {t(step.label)}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intelligence Briefs Comparison */}
        <AnimatePresence>
          {status === 'reporting' && briefs.length > 0 && (
            <div id="report-container" style={{ width: '100%', background: '#0a0a0f', padding: '2rem 0' }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '1rem', position: 'relative' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <Radar size={20} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '3px' }}>COMPARISON_ENGINE_V3</span>
                  </div>
                  <h2 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px' }}>{t('comparison')}</h2>

                  <button
                    onClick={handleExportPDF}
                    className="glass glow-on-hover"
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(0,242,255,0.1)',
                      border: '1px solid rgba(0,242,255,0.2)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} />
                    {t('EXPORT_REPORT')}
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(briefs.length, 3)}, 1fr)`,
                  gap: '2.5rem',
                  alignItems: 'start'
                }}>
                  {briefs.map((brief, bIdx) => (
                    <motion.div
                      key={bIdx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 100, delay: bIdx * 0.15 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                      {/* Column Header */}
                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="glass glow-on-hover"
                        style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid var(--accent-cyan)', background: 'linear-gradient(90deg, rgba(0,242,255,0.05) 0%, transparent 100%)', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{brief.company}</h3>
                          {brief.insights && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--accent-magenta)', letterSpacing: '1px' }}>{t('sentiment')}</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'white' }}>{brief.insights.sentiment}% {brief.insights.status}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6, letterSpacing: '1px' }}>{brief.dateRange}</div>
                      </motion.div>

                      {/* Tactical Insights (SWOT) */}
                      {brief.insights && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass"
                          style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,0,217,0.1)' }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.65rem' }}>
                            <div style={{ background: 'rgba(0,242,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                              <strong style={{ color: 'var(--accent-cyan)', display: 'block' }}>{t('strength')}</strong>
                              {brief.insights.swot.s}
                            </div>
                            <div style={{ background: 'rgba(255,0,217,0.05)', padding: '6px', borderRadius: '8px' }}>
                              <strong style={{ color: 'var(--accent-magenta)', display: 'block' }}>{t('weakness')}</strong>
                              {brief.insights.swot.w}
                            </div>
                            <div style={{ background: 'rgba(0,102,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                              <strong style={{ color: 'var(--accent-blue)', display: 'block' }}>{t('opportunity')}</strong>
                              {brief.insights.swot.o}
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                              <strong style={{ opacity: 0.5, display: 'block' }}>{t('threat')}</strong>
                              {brief.insights.swot.t}
                            </div>
                          </div>

                          {/* Phase 3 Signals */}
                          {brief.insights.signals && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                              {brief.insights.signals.github && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(168,85,247,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.2)' }}>
                                  <Github size={10} color="#a855f7" />
                                  <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#a855f7' }}>{t('GITHUB_PULSE')}</span>
                                </div>
                              )}
                              {brief.insights.signals.hiring && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59,130,246,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)' }}>
                                  <Briefcase size={10} color="#3b82f6" />
                                  <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#3b82f6' }}>{t('HIRING_SIGNAL')}</span>
                                </div>
                              )}
                              {brief.insights.signals.releases && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,0,217,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,0,217,0.2)' }}>
                                  <Rocket size={10} color="var(--accent-magenta)" />
                                  <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--accent-magenta)' }}>{t('NEW_RELEASE')}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Features List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {brief.features.length > 0 ? (
                          brief.features.map((f, i) => (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              whileHover={{ scale: 1.03, rotate: 0.5 }}
                              transition={{ delay: (bIdx * 0.2) + (i * 0.1) }}
                              key={i}
                              className="glass glass-interactive"
                              style={{
                                padding: '1.5rem',
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                borderLeft: `2px solid ${SOURCE_MAP[f.source]?.color || 'transparent'}`
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {React.createElement(SOURCE_MAP[f.source]?.icon || Zap, { size: 14, color: SOURCE_MAP[f.source]?.color || 'var(--accent-cyan)' })}
                                  <span style={{ fontSize: '0.6rem', fontWeight: '900', color: SOURCE_MAP[f.source]?.color || 'var(--accent-cyan)', letterSpacing: '1px' }}>{f.source}</span>
                                </div>
                                <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)' }}>{f.siteIcon}</span>
                              </div>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: 1.3 }}>{f.title}</h4>
                              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.85rem', opacity: 0.8 }}>{f.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent-magenta)', fontWeight: 'bold' }}>{f.date}</span>
                                <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 'bold' }}>{t('source')} →</a>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', opacity: 0.5 }}>
                            <Search size={24} style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.8rem' }}>{brief.error || t('no_results')}</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Intelligence Timeline */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: '3rem' }}
            >
              <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,0,217,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                  <HistoryIcon size={20} color="var(--accent-magenta)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-magenta)', letterSpacing: '2px' }}>{t('TIMELINE')}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {history.length > 0 ? (
                    history.map((h, i) => (
                      <motion.div
                        key={h.id}
                        whileHover={{ x: 10, background: 'rgba(255,0,217,0.05)' }}
                        onClick={() => {
                          setBriefs(h.briefs);
                          setStatus('reporting');
                          setShowHistory(false);
                        }}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                            {h.competitors.join(' vs ')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
                            {h.timestamp}
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--accent-magenta)" />
                      </motion.div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                      <p style={{ fontSize: '0.9rem' }}>No historical scans available in this node.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Key Hint */}
        {
          !(import.meta.env.VITE_SERPER_API_KEY) && (
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
          )
        }
      </main >

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
    </div >
  );
}
