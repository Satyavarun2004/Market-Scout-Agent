/**
 * Market Scout Service - Live Data Orchestrator
 * This service handles Search API calls and simulates the agentic workflow
 * using real live data results.
 */

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

export async function scoutMultipleCompetitors(queriesString, onOverallProgress) {
  const companies = queriesString.split(',').map(s => s.trim()).filter(Boolean);
  
  // Track individual progress for each
  const individualProgress = companies.map(() => -1);
  
  const promises = companies.map(async (company, index) => {
    const result = await scoutCompetitor(company, (step) => {
      individualProgress[index] = step;
      // Report the minimum step among all active searches to keep global UI moving
      const minStep = Math.min(...individualProgress.filter(p => p !== -1));
      onOverallProgress(minStep);
    });
    return result;
  });

  return Promise.all(promises);
}

export async function scoutCompetitor(companyName, onProgress) {
  try {
    // Step 0: Plan
    onProgress(0);
    await new Promise(r => setTimeout(r, 800));

    // Step 1: Multi-Source Search
    onProgress(1);
    if (!SERPER_API_KEY) {
      console.warn("Serper API Key missing. Falling back to multi-source simulated data.");
      return getSimulatedData(companyName);
    }

    // Define Specialized Queries
    const queries = {
      general: `"${companyName}" latest technical features product updates released last 7 days`,
      github: `site:github.com "${companyName}" repositories commits updates released last 14 days`,
      social: `site:reddit.com OR site:twitter.com "${companyName}" "new feature" OR "update" OR "launch" last 7 days`,
      hiring: `site:linkedin.com/jobs OR site:glassdoor.com "${companyName}" "engineer" OR "developer" OR "architect" last 30 days`,
      releases: `"${companyName}" "press release" OR "announcement" OR "product launch" OR "v3." OR "v2." last 14 days`
    };

    // Parallel Execution of all sources
    const searchPromises = Object.entries(queries).map(async ([source, q]) => {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ q, num: 5, tbs: source === 'hiring' || source === 'releases' ? 'qdr:m' : 'qdr:w' })
      });
      const data = await response.json();
      return { source, results: data.organic || [] };
    });

    const allSourceResults = await Promise.all(searchPromises);

    // Step 2: Verify & Categorize
    onProgress(2);
    
    let combinedFeatures = [];
    allSourceResults.forEach(({ source, results }) => {
      const filtered = results.filter(item => {
        const text = (item.title + " " + item.snippet).toLowerCase();
        return text.includes(companyName.toLowerCase());
      }).map(item => ({
        title: item.title,
        description: item.snippet,
        date: item.date || "Last 7 days",
        source: source.toUpperCase(),
        url: item.link,
        siteIcon: item.link ? new URL(item.link).hostname : "Source"
      }));
      combinedFeatures = [...combinedFeatures, ...filtered];
    });

    if (combinedFeatures.length === 0) {
      return {
        company: companyName.toUpperCase(),
        dateRange: "Last 7 Days (Multi-Source)",
        features: [],
        error: `No technical updates found for "${companyName}" across monitored sources.`
      };
    }
    
    // Step 3: Synthesize
    onProgress(3);
    await new Promise(r => setTimeout(r, 1000));

    const tacticalInsights = generateTacticalInsights(companyName, combinedFeatures);

    return {
      company: companyName.toUpperCase(),
      dateRange: "Phase 3: Multi-Source Active",
      timestamp: new Date().toLocaleString(),
      insights: tacticalInsights,
      features: combinedFeatures.sort((a, b) => b.source === 'GITHUB' ? 1 : -1).slice(0, 6)
    };

  } catch (error) {
    console.error("Multi-Source Scout Error:", error);
    if (!SERPER_API_KEY) return getSimulatedData(companyName);
    return {
      company: companyName.toUpperCase(),
      error: "Multi-source intake failed. Service temporarily throttled.",
      features: []
    };
  }
}

function generateTacticalInsights(companyName, results) {
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const hash = getHash(companyName.toLowerCase());
  const pools = {
    s: [
      "Dominant market position and high brand equity.",
      "Robust ecosystem with high switching costs for users.",
      "Superior R&D pipeline and intellectual property portfolio.",
      "Strong vertical integration and supply chain control.",
      "High developer sentiment and API adoption rates."
    ],
    w: [
      "Heavy reliance on a single core revenue stream.",
      "Increasing cloud infrastructure and operational costs.",
      "Bureaucratic friction slowing down agile deployment.",
      "Rising technical debt in legacy platform modules.",
      "Limited presence in emerging high-growth markets."
    ],
    o: [
      "Exploiting gaps in mid-tier enterprise AI adoption.",
      "Strategic pivoting towards decentralized cloud computing.",
      "Mergers and acquisitions of niche vertical startups.",
      "Expanding services into underserved global regions.",
      "Integration of generative AI into core consumer apps."
    ],
    t: [
      "Intrusive regulatory oversight and antitrust litigation.",
      "Disruptive competition from lean open-source startups.",
      "Rapidly evolving cybersecurity threat landscape.",
      "Shift in consumer behavior away from legacy platforms.",
      "Global economic volatility impacting enterprise spend."
    ]
  };

  const githubSignal = results.some(r => r.source === 'GITHUB');
  const hiringSignal = results.some(r => r.source === 'HIRING');
  const releaseSignal = results.some(r => r.source === 'RELEASES');
  const sentimentScore = 60 + (hash % 35) + (githubSignal ? 5 : 0) + (releaseSignal ? 10 : 0);
  
  return {
    sentiment: Math.min(sentimentScore, 100),
    status: sentimentScore > 85 ? "BULLISH" : "STABLE",
    swot: {
      s: pools.s[hash % pools.s.length],
      w: pools.w[hash % pools.w.length],
      o: pools.o[hash % pools.o.length],
      t: pools.t[hash % pools.t.length]
    },
    velocity: (results.length + (githubSignal ? 3 : 0) + (releaseSignal ? 2 : 0)) > 7 ? "HIGH" : "STEADY",
    signals: {
        github: githubSignal,
        hiring: hiringSignal,
        releases: releaseSignal
    }
  };
}

export async function sendToWebhook(url, reportData) {
  const isDiscord = url.includes('discord.com');
  const payload = isDiscord ? {
    embeds: [{
      title: `🚀 Market Scout Intelligence: ${reportData.query}`,
      color: 0x00f2ff,
      fields: reportData.briefs.map(b => ({
        name: b.company,
        value: `Sentiment: ${b.insights.sentiment}% (${b.insights.status})\nVelocity: ${b.insights.velocity}`
      }))
    }]
  } : {
    text: `*Market Scout Intelligence Alert: ${reportData.query}*\n` + 
          reportData.briefs.map(b => `> *${b.company}*: ${b.insights.sentiment}% ${b.insights.status} | Velocity: ${b.insights.velocity}`).join('\n')
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err) {
    console.error("Webhook failure:", err);
    return false;
  }
}

export function analyzeTriggers(results) {
  const alerts = [];
  results.forEach(b => {
    if (b.insights.sentiment >= 90) alerts.push({ company: b.company, type: 'CRITICAL', msg: 'Sentiment high-spike detected.' });
    if (b.insights.velocity === 'HIGH') alerts.push({ company: b.company, type: 'MOMENTUM', msg: 'Rapid technical/hiring movement.' });
    if (b.insights.signals?.releases) alerts.push({ company: b.company, type: 'RELEASE', msg: 'Official product launch detected.' });
  });
  return alerts;
}

function getSimulatedData(companyName) {
  const variations = [
    {
      title: "Enterprise AI Modernization",
      desc: `Launched a new suite of GenAI tools specifically tailored for ${companyName}'s core service offerings, focusing on automated workflow optimization.`
    },
    {
      title: "Strategic Cloud Partnership",
      desc: `${companyName} announced a multi-year collaboration to expand their global cloud footprint and enhance edge computing capabilities.`
    },
    {
      title: "Cybersecurity Enhancement",
      desc: `Integrated a new zero-trust security architecture across ${companyName}'s internal and client-facing infrastructure.`
    }
  ];

  // Pick 2 random variations
  const shuffled = [...variations].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 2);

  return {
    company: companyName.toUpperCase(),
    dateRange: "Demo Mode (Enhanced Simulation)",
    insights: generateTacticalInsights(companyName, selected),
    features: selected.map(v => ({
      title: v.title,
      description: v.desc,
      date: "Feb 10, 2026",
      source: "Industry Insight",
      url: "#"
    }))
  };
}
