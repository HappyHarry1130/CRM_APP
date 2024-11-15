import { FilterGroup } from '../types';

export const filters: FilterGroup[] = [
  {
    name: 'stages',
    options: [
      { count: 10173, value: 'Seed round' },
      { count: 8245, value: 'Series E' },
      { count: 7838, value: 'Series B' },
      { count: 7675, value: 'Series C' },
      { count: 7663, value: 'Series D' },
      { count: 7308, value: 'Series A' },
      { count: 7190, value: 'Pre-seed' }
    ]
  },
  {
    name: 'regions',
    options: [
      { count: 6176, value: 'North America' },
      { count: 691, value: 'Asia' },
      { count: 670, value: 'Europe' },
      { count: 248, value: 'Latin America' },
      { count: 71, value: 'Africa' }
    ]
  },
  {
    name: 'sectors',
    options: [
      { count: 3395, value: 'SaaS' },
      { count: 3203, value: 'Manufacturing' },
      { count: 1885, value: 'E-Commerce' },
      { count: 1864, value: 'Mobile' },
      { count: 1686, value: 'Enterprise Software' }
    ]
  }
];