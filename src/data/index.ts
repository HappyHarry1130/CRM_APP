import { VCContact, Filter } from '../types';

export const vcContacts: VCContact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Partner',
    firm: 'Accel Ventures',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
    focus: ['SaaS', 'Enterprise Software', 'AI'],
    matchScore: 95,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Managing Director',
    firm: 'Sequoia Capital',
    location: 'Menlo Park, CA',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&h=128',
    focus: ['FinTech', 'Blockchain', 'E-Commerce'],
    matchScore: 88,
  },
  {
    id: '3',
    name: 'Emily Roberts',
    title: 'Principal',
    firm: 'Andreessen Horowitz',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128',
    focus: ['Healthcare', 'BioTech', 'Life Science'],
    matchScore: 82,
  },
];

export const filters: Filter[] = [
  {
    category: 'stages',
    label: 'Investment Stage',
    options: [
      { value: 'Seed round', count: 10173 },
      { value: 'Series A', count: 7308 },
      { value: 'Series B', count: 7838 },
      { value: 'Series C', count: 7675 },
    ],
  },
  {
    category: 'sectors',
    label: 'Sectors',
    options: [
      { value: 'SaaS', count: 3395 },
      { value: 'E-Commerce', count: 1885 },
      { value: 'Healthcare', count: 1359 },
      { value: 'FinTech', count: 1245 },
    ],
  },
  {
    category: 'regions',
    label: 'Regions',
    options: [
      { value: 'North America', count: 6176 },
      { value: 'Europe', count: 670 },
      { value: 'Asia', count: 691 },
      { value: 'Latin America', count: 248 },
    ],
  },
];