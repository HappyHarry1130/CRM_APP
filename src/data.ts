import { VCContact, MediaContact } from './types';

export const vcContacts: VCContact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@beyond.vc',
    phone: '+1 (415) 555-0123',
    firm: 'Beyond Ventures',
    investmentFocus: ['SaaS', 'AI/ML', 'Enterprise'],
    portfolioSize: '$850M',
    checkSize: '$2M-10M',
    stage: ['Series A', 'Series B'],
    lastContact: '2024-03-10',
    notes: 'Interested in AI-powered enterprise solutions',
    tags: ['Warm', 'Enterprise', 'Quick Response'],
    linkedIn: 'linkedin.com/in/sarahchen',
    matchScore: 0.92,
    status: 'meeting'
  },
  {
    id: '2',
    name: 'Michael Torres',
    email: 'mt@catalyst.fund',
    phone: '+1 (650) 555-0456',
    firm: 'Catalyst Fund',
    investmentFocus: ['FinTech', 'Web3', 'Climate'],
    portfolioSize: '$1.2B',
    checkSize: '$5M-20M',
    stage: ['Series B', 'Series C'],
    lastContact: '2024-03-15',
    notes: 'Looking for sustainability-focused startups',
    tags: ['Very Warm', 'ESG', 'Strategic'],
    linkedIn: 'linkedin.com/in/michaeltorres',
    matchScore: 0.85,
    status: 'negotiating'
  },
  {
    id: '3',
    name: 'Emily Zhang',
    email: 'emily@innovation.cap',
    firm: 'Innovation Capital',
    investmentFocus: ['HealthTech', 'BioTech', 'AI'],
    portfolioSize: '$600M',
    checkSize: '$1M-5M',
    stage: ['Seed', 'Series A'],
    lastContact: '2024-03-08',
    notes: 'Strong interest in AI applications in healthcare',
    tags: ['Healthcare', 'Early Stage'],
    linkedIn: 'linkedin.com/in/emilyzhang',
    matchScore: 0.78,
    status: 'contacted'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@frontier.vc',
    firm: 'Frontier Ventures',
    investmentFocus: ['Deep Tech', 'Space', 'Robotics'],
    portfolioSize: '$2B',
    checkSize: '$10M-50M',
    stage: ['Series B', 'Series C'],
    lastContact: '2024-03-01',
    notes: 'Looking for breakthrough technologies',
    tags: ['Deep Tech', 'Large Checks'],
    linkedIn: 'linkedin.com/in/davidpark',
    matchScore: 0.65,
    status: 'new'
  }
];

export const mediaContacts: MediaContact[] = [
  {
    id: '5',
    name: 'Alex Rivera',
    email: 'alex.r@techcrunch.com',
    outlet: 'TechCrunch',
    beats: ['Startups', 'VC', 'Enterprise Tech'],
    timezone: 'PT',
    preferredContactMethod: 'Email',
    lastContact: '2024-03-12',
    notes: 'Prefers early morning pitches',
    tags: ['Tier 1', 'Quick Response'],
    recentArticles: [
      'The Rise of AI in Enterprise',
      'Top 10 Enterprise Startups to Watch'
    ],
    deadlinePreference: 'Two weeks notice',
    matchScore: 0.95,
    status: 'closed'
  },
  {
    id: '6',
    name: 'Maya Patel',
    email: 'maya@bloomberg.net',
    outlet: 'Bloomberg',
    beats: ['FinTech', 'Venture Capital', 'IPOs'],
    timezone: 'ET',
    preferredContactMethod: 'Signal',
    lastContact: '2024-03-14',
    notes: 'Interested in exclusive funding news',
    tags: ['Tier 1', 'Financial Focus'],
    recentArticles: [
      'VC Funding Reaches New Heights',
      'The Evolution of FinTech'
    ],
    deadlinePreference: 'One week notice',
    matchScore: 0.88,
    status: 'meeting'
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'jwilson@wired.com',
    outlet: 'Wired',
    beats: ['AI', 'Future of Work', 'Innovation'],
    timezone: 'ET',
    preferredContactMethod: 'Email',
    lastContact: '2024-03-05',
    notes: 'Loves deep-dive technical stories',
    tags: ['Tier 1', 'Tech Focus'],
    recentArticles: [
      'AI Revolution in the Workplace',
      'Future of Remote Work'
    ],
    deadlinePreference: 'Three weeks notice',
    matchScore: 0.72,
    status: 'contacted'
  },
  {
    id: '8',
    name: 'Sophie Chen',
    email: 'sophie@theinformation.com',
    outlet: 'The Information',
    beats: ['Startups', 'VC', 'Enterprise'],
    timezone: 'PT',
    preferredContactMethod: 'Email',
    lastContact: '2024-03-10',
    notes: 'Interested in exclusive scoops',
    tags: ['Tier 1', 'Premium'],
    recentArticles: [
      'Inside the Latest Startup Valuations',
      'Enterprise Software Trends'
    ],
    deadlinePreference: 'One week notice',
    matchScore: 0.68,
    status: 'new'
  }
];