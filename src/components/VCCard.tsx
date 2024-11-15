import React from "react";
import { MapPin, Building2, Target, Users, Globe } from "lucide-react";
import { VCContact } from "../types/api";
import { MatchScore } from "./MatchScore";

interface VCCardProps {
  contact: VCContact;
  onClick: () => void;
  disabled: boolean;
  connects: number;
}

export function VCCard({ contact, onClick, disabled, connects }: VCCardProps) {
  const location = [contact.city, contact.state, contact.country]
    .filter(Boolean)
    .join(", ");

  const hasTeam = contact.team && contact.team.length > 0;
  const hasSectors = contact.sectors && contact.sectors.length > 0;
  const hasStages = contact.stages && contact.stages.length > 0;
  const hasGeoFocus =
    contact.geographical_focus && contact.geographical_focus.length > 0;

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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {contact.name}
            </h3>
            {location && (
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>
          {contact.relevance_score && (
            <MatchScore score={contact.relevance_score} />
          )}
        </div>

        {contact.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {contact.description}
          </p>
        )}

        {(hasSectors || hasStages || hasGeoFocus) && (
          <div className="space-y-3">
            {hasSectors && (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {contact.sectors.slice(0, 3).map((sector) => (
                    <span
                      key={sector}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                    >
                      {sector}
                    </span>
                  ))}
                  {contact.sectors.length > 3 && (
                    <span className="text-gray-500 text-xs mt-1">
                      +{contact.sectors.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {hasStages && (
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {contact.stages.slice(0, 3).map((stage) => (
                    <span
                      key={stage}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                    >
                      {stage}
                    </span>
                  ))}
                  {contact.stages.length > 3 && (
                    <span className="text-gray-500 text-xs mt-1">
                      +{contact.stages.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {hasGeoFocus && (
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {contact.geographical_focus.slice(0, 2).map((region) => (
                    <span
                      key={region}
                      className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs"
                    >
                      {region}
                    </span>
                  ))}
                  {contact.geographical_focus.length > 2 && (
                    <span className="text-gray-500 text-xs mt-1">
                      +{contact.geographical_focus.length - 2} more regions
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {hasTeam && (
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {contact.team[0].name} ({contact.team[0].role})
                {contact.team.length > 1 && ` +${contact.team.length - 1} more`}
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

      <div className="text-sm text-gray-500 mt-2">
        Available connects: {connects}
      </div>
    </div>
  );
}
