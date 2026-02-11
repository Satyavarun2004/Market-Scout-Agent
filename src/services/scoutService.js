/**
 * Market Scout Service - Live Data Orchestrator
 * This service handles Search API calls and simulates the agentic workflow
 * using real live data results.
 */

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

export async function scoutCompetitor(companyName, onProgress) {
  const steps = [
    { id: 0, label: 'Planning Queries' },
    { id: 1, label: 'Searching Live Web' },
    { id: 2, label: 'Verifying Updates' },
    { id: 3, label: 'Synthesizing Brief' }
  ];

  try {
    // Step 0: Plan
    onProgress(0);
    await new Promise(r => setTimeout(r, 1000));

    // Step 1: Search
    onProgress(1);
    if (!SERPER_API_KEY) {
      console.warn("Serper API Key missing. Falling back to simulated data.");
      return getSimulatedData(companyName);
    }

    // Use quotes for exact company match to avoid generic results for gibberish
    const query = `"${companyName}" latest technical features product updates released last 7 days`;
    
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        num: 10, // Fetch more to allow for filtering
        tbs: "qdr:w" // Strictly last week
      })
    });

    const data = await response.json();

    // Step 2: Verify & Filter
    onProgress(2);
    
    let relevantResults = [];
    if (data.organic && data.organic.length > 0) {
      // Strict Relevance Filter: Company name must appear in title or snippet
      const searchTerms = companyName.toLowerCase().split(' ');
      relevantResults = data.organic.filter(item => {
        const textToSearch = (item.title + " " + item.snippet).toLowerCase();
        // Check if all parts of the company name are found (or at least the first if it's multiple)
        return textToSearch.includes(companyName.toLowerCase());
      });
    }

    if (relevantResults.length === 0) {
      // Return empty results object if no RELEVANT results found
      return {
        company: companyName.toUpperCase(),
        dateRange: "Last 7 Days (Live)",
        timestamp: new Date().toLocaleString(),
        features: [],
        error: `No verified updates found for "${companyName}" in the last 7 days.`
      };
    }
    
    // Step 3: Synthesize
    onProgress(3);
    await new Promise(r => setTimeout(r, 1000));

    // Map search results to our UI format
    return {
      company: companyName.toUpperCase(),
      dateRange: "Last 7 Days (Live)",
      timestamp: new Date().toLocaleString(),
      features: relevantResults.slice(0, 4).map(item => ({
        title: item.title,
        description: item.snippet,
        date: item.date || "Just now",
        source: item.site || (item.link ? new URL(item.link).hostname : "Source"),
        url: item.link
      }))
    };

  } catch (error) {
    console.error("Scout Error:", error);
    // Only fall back to simulated data if API key is missing
    if (!SERPER_API_KEY) {
      return getSimulatedData(companyName);
    }
    // Otherwise return error state
    return {
      company: companyName.toUpperCase(),
      error: "Search failed. Please try again later.",
      features: []
    };
  }
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
    features: selected.map(v => ({
      title: v.title,
      description: v.desc,
      date: "Feb 10, 2026",
      source: "Industry Insight",
      url: "#"
    }))
  };
}
