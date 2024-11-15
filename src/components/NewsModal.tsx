import React from 'react';
import { X, ArrowUpRight, Calendar, Tag, Building2 } from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsModal({ isOpen, onClose }: NewsModalProps) {
  const allNews = [
    {
      category: 'Industry News',
      title: 'AI Startup Funding Reaches New Heights in Q1 2024',
      source: 'TechCrunch',
      time: '2h ago',
      relevance: 'High relevance: Matches your AI/ML focus',
      description: 'Venture capital investments in AI startups hit a record $12.4B in Q1 2024, marking a 45% increase YoY.',
      url: '#'
    },
    {
      category: 'Market Update',
      title: 'Enterprise Software Market Expected to Hit $500B by 2025',
      source: 'Bloomberg',
      time: '5h ago',
      relevance: 'Aligned with your target market',
      description: 'Growing demand for AI-powered enterprise solutions drives market expansion.',
      url: '#'
    },
    {
      category: 'Competitor News',
      title: 'OpenAI Launches Enterprise Data Processing Solution',
      source: 'Reuters',
      time: '1d ago',
      relevance: 'Direct competitor update',
      description: 'New solution promises 3x faster document processing with enhanced accuracy.',
      url: '#'
    },
    {
      category: 'Investment Trends',
      title: 'Enterprise AI Startups See Surge in Series A Rounds',
      source: 'VentureBeat',
      time: '1d ago',
      relevance: 'Relevant for fundraising strategy',
      description: 'Average Series A round size increases to $15M for enterprise AI startups.',
      url: '#'
    },
    {
      category: 'Market Research',
      title: 'Enterprise Document Processing: Market Analysis 2024',
      source: 'Gartner',
      time: '2d ago',
      relevance: 'Key market insights',
      description: 'Comprehensive analysis of the enterprise document processing market.',
      url: '#'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
              <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                5 new updates
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {allNews.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {item.time}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="w-4 h-4 mr-1" />
                        {item.source}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Tag className="w-4 h-4" />
                        {item.relevance}
                      </div>
                      <a
                        href={item.url}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read more
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}