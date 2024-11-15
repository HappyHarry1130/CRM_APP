import React from "react";
import { MapPin, Newspaper, Tag, Globe, Users } from "lucide-react";
import { MatchScore } from "./MatchScore";

interface MediaContact {
  id: string;
  type?: string;
  category?: string;
  site_name: string;
  author: string;
  description?: string;
  topics?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  outlets?: Array<{
    name: string;
    title: string;
  }>;
  relevance_score?: number;
}

interface MediaCardProps {
  contact: MediaContact;
  onClick: () => void;
  disabled: boolean;
  connects: number;
}

export function MediaCard({
  contact,
  onClick,
  disabled,
  connects,
}: MediaCardProps) {
  const location = [
    contact.location?.city,
    contact.location?.state,
    contact.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const topics = contact.topics?.split(",").map((topic) => topic.trim()) || [];
  const hasOutlets = contact.outlets && contact.outlets.length > 0;

  const formatType = (type?: string) => {
    if (!type) return "";
    return type.replace(/_/g, " ").toLowerCase();
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative 
        rounded-lg 
        border 
        border-gray-200 
        bg-white 
        p-6 
        transition-shadow 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg"
        }
      `}
    >
      <div className="space-y-4 flex-1">
        {/* Header with Type Badge and Match Score */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {contact.type && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium capitalize">
                  {formatType(contact.type)}
                </span>
              )}
              {contact.category && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  {contact.category}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {contact.author}
            </h3>
            <p className="text-gray-600 text-sm">{contact.site_name}</p>
          </div>
          {contact.relevance_score && (
            <MatchScore score={contact.relevance_score / 100} />
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {/* Description */}
        {contact.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {contact.description}
          </p>
        )}

        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex items-start gap-2">
            <Tag className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-gray-500 text-xs mt-1">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Outlets */}
        {hasOutlets && (
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {contact.outlets[0].name}
                {contact.outlets.length > 1 &&
                  ` +${contact.outlets.length - 1} more`}
              </span>
            </div>
          </div>
        )}
      </div>

      {disabled && (
        <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center rounded-lg">
          <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-md">
            No connects remaining
          </p>
        </div>
      )}
    </div>
  );
}
