import { SearchResponse, Facets, MediaContact, VCContact } from '../types/api';
import firebase from '../utilies/firebase/firebaseConfig'
import db from '../utilies/firebase/firebaseConfig'
// Mock data for VC contacts
export const vcContacts: VCContact[] = [
  {
    id: "7f6d1b4d-99f9-4159-96b8-c0adc7e2e34c",
    name: "Big Society Capital",
    firm: "Big Society Capital",
    description: "Big Society Capital (BSC) is an economic development agency based in London, United Kingdom. Established in 2012, the agency is an independent social investment institution that provides finance to organizations that support frontline social sector entities tackling social issues to help them grow.",
    sectors: ["Financial Services", "Social Enterprises", "Technology Startups"],
    stages: ["Pre-seed", "Seed round", "Series A", "Series B"],
    geographical_focus: ["United Kingdom"],
    traction: "Evidence of social impact and potential for growth.",
    revenue: "Varies by investment type; typically looking for sustainable business models.",
    market_size: "Focus on scalable solutions addressing significant social issues.",
    how_to_pitch: "Submit a detailed proposal outlining your business model, social impact, and financial projections.",
    submission_link: "https://bigsocietycapital.com/contact",
    decision_timeline: "Typically within 6-8 weeks after submission.",
    city: "London",
    state: "",
    country: "United Kingdom",
    regions: [],
    categories: ["Impact Investing", "Social Impact", "Venture Capital"],
    team: [
      {
        name: "Douglas Sloan",
        role: "Managing Director",
        linkedin: "https://linkedin.com/in/douglas-sloan",
        twitter: "https://twitter.com/douglassloan",
        email: "douglas@bigsocietycapital.com"
      },
      {
        name: "Ellie Broad",
        role: "Community Manager",
        linkedin: "https://linkedin.com/in/ellie-broad",
        twitter: "https://twitter.com/elliebroad",
        email: "ellie@bigsocietycapital.com"
      }
    ],
    contact_info: {
      emails: ["info@bigsocietycapital.com"],
      website: "bigsocietycapital.com",
      contact_form: "https://bigsocietycapital.com/contact",
      social_links: {
        linkedin: "https://www.linkedin.com/company/big-society-capital",
        twitter: "http://twitter.com/BigSocietyCap"
      }
    },
    relevance_score: 90,
    notes: [],
    status: 'new',
    lastUpdated: new Date().toISOString()
  },
  {
    id: "dd8f9f98-e311-4820-beed-2082b082605c",
    name: "Better Society Capital",
    firm: "Better Society Capital",
    description: "Better Society Capital (BSC) is an economic development agency based in London, United Kingdom. Established in 2012, BSC is an independent social investment institution that provides finance to organizations supporting frontline social sector entities.",
    sectors: ["Financial Services", "Social Outcomes", "Social Lending", "Impact Venture"],
    stages: ["Pre-seed", "Seed round", "Series A"],
    geographical_focus: ["United Kingdom"],
    traction: "Organizations tackling social issues with measurable impact.",
    revenue: "Focus on sustainable business models.",
    market_size: "Targeting significant social issues such as child poverty, homelessness, and health conditions.",
    how_to_pitch: "Interested parties should reach out via the contact form or email to discuss potential investment opportunities.",
    submission_link: "https://bettersocietycapital.com/contact",
    decision_timeline: "Typically within a few weeks, depending on the complexity of the proposal.",
    city: "London",
    state: "",
    country: "United Kingdom",
    regions: [],
    categories: ["Social Impact Investment", "Venture Capital", "Social Enterprises"],
    team: [
      {
        name: "Julie Rubenstein",
        role: "Venture Investment Manager",
        linkedin: "https://linkedin.com/in/julie-rubenstein",
        twitter: "https://twitter.com/julierubenstein",
        email: "julie@bettersocietycapital.com"
      }
    ],
    contact_info: {
      emails: ["info@bettersocietycapital.com"],
      website: "bettersocietycapital.com",
      contact_form: "https://bettersocietycapital.com/contact",
      social_links: {
        linkedin: "https://www.linkedin.com/company/better-society-capital",
        twitter: "https://twitter.com/BetterSocCap"
      }
    },
    relevance_score: 85,
    notes: [],
    status: 'new',
    lastUpdated: new Date().toISOString()
  }
];

// Mock data for Media contacts
export const mediaContacts: MediaContact[] = [
  {
    id: "5ab0afda-3ee7-4ad5-bde7-9cc4c72420ae",
    type: "journalists",
    category: "Freelance Journalist",
    site_name: "TechCrunch",
    website_url: "https://techcrunch.com",
    author: "Sarah Johnson",
    email: "sarah.johnson@techcrunch.com",
    description: "Senior technology journalist covering AI, enterprise software, and venture capital.",
    topics: "artificial intelligence, enterprise software, venture capital, startups",
    location: {
      country: "United States",
      state: "California",
      city: "San Francisco"
    },
    social_links: {
      twitter_url: "https://twitter.com/sarahtechwriter",
      linkedin_url: "https://linkedin.com/in/sarahjohnsontech"
    },
    outlets: [
      {
        name: "TechCrunch",
        url: "https://techcrunch.com/author/sarah-johnson",
        email: "sarah.johnson@techcrunch.com",
        title: "Senior Reporter"
      }
    ],
    relevance_score: 95,
    notes: [],
    status: 'new',
    lastUpdated: new Date().toISOString()
  },
  {
    id: "15c5f08a-d379-4fc6-86c7-4dfdbb684b90",
    type: "journalists",
    category: "Technology Reporter",
    site_name: "The Information",
    website_url: "https://theinformation.com",
    author: "Michael Chen",
    email: "mchen@theinformation.com",
    description: "Enterprise technology reporter focusing on cloud computing and AI applications.",
    topics: "cloud computing, enterprise AI, SaaS, digital transformation",
    location: {
      country: "United States",
      state: "New York",
      city: "New York City"
    },
    social_links: {
      twitter_url: "https://twitter.com/mchentech",
      linkedin_url: "https://linkedin.com/in/michaelchentech"
    },
    outlets: [
      {
        name: "The Information",
        url: "https://theinformation.com/author/michael-chen",
        email: "mchen@theinformation.com",
        title: "Reporter"
      }
    ],
    relevance_score: 88,
    notes: [],
    status: 'new',
    lastUpdated: new Date().toISOString()
  }
];

// Mock facets data
const mockVCFacets: Facets = {
  stages: [
    { value: 'Seed round', count: 10173 },
    { value: 'Series A', count: 7308 },
    { value: 'Series B', count: 7838 },
    { value: 'Series C', count: 7675 }
  ],
  regions: [
    { value: 'North America', count: 6176 },
    { value: 'Europe', count: 670 },
    { value: 'Asia', count: 691 }
  ],
  sectors: [
    { value: 'SaaS', count: 3395 },
    { value: 'FinTech', count: 1885 },
    { value: 'AI/ML', count: 1359 }
  ],
  geographical_focus: [
    { value: 'United States', count: 5000 },
    { value: 'Europe', count: 3000 },
    { value: 'Global', count: 2000 }
  ],
  city: [],
  country: [],
  state: [],
  categories: []
};

const mockMediaFacets: Facets = {
  type: [
    { value: 'journalists', count: 11836 },
    { value: 'podcasts', count: 34498 },
    { value: 'youtube', count: 19978 }
  ],
  category: [
    { value: 'Technology', count: 4121 },
    { value: 'Business', count: 1429 },
    { value: 'Finance', count: 540 }
  ],
  'location/city': [
    { value: 'New York City', count: 3931 },
    { value: 'San Francisco', count: 3212 },
    { value: 'London', count: 1616 }
  ],
  stages: [],
  regions: [],
  sectors: [],
  geographical_focus: [],
  city: [],
  country: [],
  state: [],
  categories: []
};



export async function aiSearch(context: string, type: string): Promise<SearchResponse> {
  let apiUrl = "";
  if (type === "media") { apiUrl = `https://api.iylavista.com/api/media-contacts/ai-search` }
  else { apiUrl = `https://api.iylavista.com/api/vc-contacts/ai-search` }
  const requestPayload = {
    context,
    top: 10,
    max_results: 50,
    page: 1,
    skip: 0,
  };
  return new Promise(async (resolve) => {
    try {
      let response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server.');
      }

      let data = await response.json();
      const results = data.results;
      resolve({
        results,
        matched_sectors: ["Social Impact", "Technology", "Financial Services"],
        generated_query: context
      });
    } catch (error) {
      console.error("Error during search:", error);
      resolve({
        results: [],
        matched_sectors: [],
        generated_query: context
      });
    }
  });
}

export async function search(query: string, type: string, sector: string = '', stage: string = ''): Promise<SearchResponse> {
  try {


    console.log("Fetched user sectors:", sector);
    console.log("Fetched user stages:", stage);

    let requestPayload;
    let apiUrl;

    if (type === 'media') {
      apiUrl = `https://api.iylavista.com/api/media-contacts/search`;
      requestPayload = {
        query,
        top: 10,
        max_results: 50,
        filters: "",
        facets: [],
        skip: 0,
        page: 1
      };
    } else {
      apiUrl = `https://api.iylavista.com/api/vc-contacts/search`;
      requestPayload = {
        query: `Investors in ${sector} with ${stage}`,
        filters: sector.length > 0 && stage.length > 0
          ? `sectors/any(s: s eq '${sector}') and stages/any(st: st eq '${stage}')`
          : "",
        max_results: 50,
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from the server.');
    }

    const data = await response.json();
    const results = data.results;
    const userSectors = ['Financial Services', 'Social Impact', 'Technology'];
    return {
      results,
      matched_sectors: type === 'vc' ? userSectors : [],
      generated_query: query
    };

  } catch (error) {
    console.error("Error during search:", error);
    return {
      results: [],
      matched_sectors: [],
      generated_query: query
    };
  }
}

export async function getFacets(type: 'vc' | 'media' = 'vc'): Promise<Facets> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(type === 'vc' ? mockVCFacets : mockMediaFacets);
    }, 500);
  });
}