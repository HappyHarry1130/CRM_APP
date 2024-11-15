export interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface MediaContact {
  id: string;
  type: string;
  category: string;
  site_name: string;
  website_url: string;
  author: string;
  email: string;
  description: string;
  topics: string;
  location: {
    country: string;
    state?: string;
    city?: string;
  };
  social_links: {
    twitter_url?: string;
    linkedin_url?: string;
  };
  outlets?: Array<{
    name: string;
    url: string;
    email?: string;
    title?: string;
  }>;
  relevance_score: number;
  notes?: Note[];
  status?: string;
  lastUpdated?: string;
}

export interface VCContact {
  id: string;
  name: string;
  firm: string;
  description: string;
  sectors?: string[];
  stages?: string[];
  geographical_focus?: string[];
  traction?: string;
  revenue?: string;
  market_size?: string;
  how_to_pitch?: string;
  submission_link?: string;
  decision_timeline?: string;
  city?: string;
  state?: string;
  country?: string;
  regions?: string[];
  categories?: string[];
  team?: Array<{
    name: string;
    role: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  }>;
  contact_info?: {
    emails?: string[];
    website?: string;
    contact_form?: string;
    social_links?: {
      linkedin?: string;
      twitter?: string;
    };
  };
  relevance_score: number;
  notes?: Note[];
  status?: string;
  lastUpdated?: string;
}

export interface SearchResponse {
  results: Array<VCContact | MediaContact>;
  matched_sectors: string[];
  generated_query: string;
}

export interface FilterState {
  [key: string]: string;
}

export interface Facets {
  stages: Array<{ count: number; value: string }>;
  regions: Array<{ count: number; value: string }>;
  sectors?: Array<{ count: number; value: string }>;
  geographical_focus: Array<{ count: number; value: string }>;
  city: Array<{ count: number; value: string }>;
  country: Array<{ count: number; value: string }>;
  state: Array<{ count: number; value: string }>;
  categories: Array<{ count: number; value: string }>;
  type?: Array<{ count: number; value: string }>;
  category?: Array<{ count: number; value: string }>;
  'location/city'?: Array<{ count: number; value: string }>;
}