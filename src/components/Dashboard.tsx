import React, { useEffect, useState } from "react";
import {
  Newspaper,
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Users2,
  Inbox,
  LineChart,
  Search,
  X,
} from "lucide-react";
import { NewsModal } from "./NewsModal";

interface NewsItem {
  category: string;
  title: string;
  subtitle: string;
  relevance: string;
  source: string;
  url: string;
  date: string;
}
export function Dashboard({
  onRouteChange,
}: {
  onRouteChange: (route: string) => void;
}) {
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://20.127.158.98:8012/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_description:
            "AI-powered startup growth platform focusing on helping startups connect with VCs and media contacts",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();
      setNewsItems(data.news_items);
    } catch (err) {
      setError("Failed to load news items");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const industryPulse = [
    {
      metric: "AI/ML Funding",
      trend: "+15%",
      description: "Month-over-month increase in AI/ML startup investments",
      sentiment: "positive",
    },
    {
      metric: "Enterprise Tech",
      trend: "+8%",
      description: "Growing enterprise adoption of AI solutions",
      sentiment: "positive",
    },
    {
      metric: "Market Competition",
      trend: "+12%",
      description: "New entrants in enterprise AI space",
      sentiment: "neutral",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100 text-lg">
            Your AI-powered startup growth platform
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => onRouteChange("crm")}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pipeline111
                </h3>
              </div>
              <p className="text-gray-600">Manage your outreach</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => onRouteChange("vc")}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Users2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Find VCs
                </h3>
              </div>
              <p className="text-gray-600">Discover investors</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => onRouteChange("media")}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Find Media
                </h3>
              </div>
              <p className="text-gray-600">Connect with journalists</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Trending News
            </h2>
            <button
              onClick={() => setShowNewsModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All News
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading news...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No news items available
              </div>
            ) : (
              newsItems.slice(0, 2).map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">
                          {item.relevance}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Source: {item.source}
                      </div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Industry Pulse */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Industry Pulse
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <LineChart className="w-4 h-4" />
              <span>Last 30 days</span>
            </div>
          </div>

          <div className="space-y-4">
            {industryPulse.map((item) => (
              <div
                key={item.metric}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.metric}</h3>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      item.sentiment === "positive"
                        ? "text-green-700 bg-green-50"
                        : item.sentiment === "negative"
                        ? "text-red-700 bg-red-50"
                        : "text-yellow-700 bg-yellow-50"
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
      />
    </div>
  );
}
