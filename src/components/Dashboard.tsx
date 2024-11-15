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
  ArrowUpRight,
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
  const [industryPulse, setIndustryPulse] = useState<[]>([]);

  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-500/10 to-purple-500/10",
      "from-green-500/10 to-emerald-500/10",
      "from-orange-500/10 to-red-500/10",
      "from-indigo-500/10 to-blue-500/10",
      "from-pink-500/10 to-rose-500/10",
    ];
    return gradients[index % gradients.length];
  };

  const getNumberColor = (index: number) => {
    const colors = [
      "text-blue-600",
      "text-green-600",
      "text-orange-600",
      "text-indigo-600",
      "text-pink-600",
    ];
    return colors[index % colors.length];
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch news
        const newsResponse = await fetch("http://20.127.158.98:8012/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_description:
              "AI-powered startup growth platform focusing on helping startups connect with VCs and media contacts",
          }),
        });

        // Fetch pulse data
        const pulseResponse = await fetch(
          "https://api.iylavista.com/api/dashboard/pulse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              company_description:
                "AI-powered startup growth platform focusing on helping startups connect with VCs and media contacts",
            }),
          }
        );

        if (!newsResponse.ok || !pulseResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [newsData, pulseData] = await Promise.all([
          newsResponse.json(),
          pulseResponse.json(),
        ]);

        setNewsItems(newsData.news_items);
        setIndustryPulse(pulseData.facts);
        console.log(pulseData);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const industryPulse1 = [
  //   {
  //     number: "55M",
  //     fact: "Downloads For Buddy.ai",
  //     url: "https://techcrunch.com/2024/10/31/buddy-ai-is-using-ai-and-gaming-to-help-children-learn-english-as-a-second-language/",
  //   },
  //   {
  //     number: "$259",
  //     fact: "AI Menopause Kit Available",
  //     url: "https://hitconsultant.net/2024/10/18/mira-launches-ai-powered-menopause-transitions-kit/",
  //   },
  //   {
  //     number: "1,245",
  //     fact: "AI Deals In Q3 2024",
  //     url: "https://www.cbinsights.com/research/report/ai-trends-q3-2024/",
  //   },
  // ];
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
                  Pipeline
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
            {newsItems.slice(0, 2).map((item) => (
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
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        {item.relevance}
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.url}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
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
              <span>Latest Updates</span>
            </div>
          </div>

          <div className="space-y-3">
            {industryPulse.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div
                  className={`mb-[15px] h-[100px] bg-gradient-to-r ${getGradient(
                    index
                  )} bg-white rounded-lg p-4 border border-gray-100 transition-all duration-200 hover:scale-102 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xl font-bold ${getNumberColor(
                          index
                        )} block truncate`}
                      >
                        {item.fact}
                      </span>
                      <p className="text-sm text-gray-800 font-medium mt-0.5 truncate">
                        {item.text}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-3" />
                  </div>
                </div>
              </a>
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
