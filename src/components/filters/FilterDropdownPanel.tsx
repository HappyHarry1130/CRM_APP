import React from "react";
import { FilterGroup } from "./FilterGroup";
import { useFacets } from "../../hooks/useFacets";
import { FilterState } from "../../types/api";

interface FilterDropdownPanelProps {
  activeFilters: FilterState;
  onFilterChange: (category: string, value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onClose: () => void;
  type?: "vc" | "media";
}

export function FilterDropdownPanel({
  activeFilters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  onClose,
  type = "vc",
}: FilterDropdownPanelProps) {
  const { facets, loading } = useFacets();

  if (loading) {
    return (
      <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded w-32"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="p-4 space-y-4">
          {type === "vc" ? (
            // VC Filters
            <>
              <FilterGroup
                title="Investment Stage"
                items={facets.stages}
                selectedValue={activeFilters.stage}
                onChange={(value) => onFilterChange("stage", value)}
              />
              <FilterGroup
                title="Region"
                items={facets.regions}
                selectedValue={activeFilters.region}
                onChange={(value) => onFilterChange("region", value)}
              />
              <FilterGroup
                title="Sector"
                items={facets.sectors}
                selectedValue={activeFilters.sector}
                onChange={(value) => onFilterChange("sector", value)}
              />
              <FilterGroup
                title="Location"
                items={facets.geographical_focus}
                selectedValue={activeFilters.location}
                onChange={(value) => onFilterChange("location", value)}
              />
            </>
          ) : (
            // Media Filters
            <>
              <FilterGroup
                title="Media Type"
                items={facets.type}
                selectedValue={activeFilters.type}
                onChange={(value) => onFilterChange("type", value)}
              />
              <FilterGroup
                title="Category"
                items={facets.category}
                selectedValue={activeFilters.category}
                onChange={(value) => onFilterChange("category", value)}
              />
              <FilterGroup
                title="City"
                items={facets["location/city"]}
                selectedValue={activeFilters.city}
                onChange={(value) => onFilterChange("city", value)}
              />
              <FilterGroup
                title="State"
                items={facets["location/state"]}
                selectedValue={activeFilters.state}
                onChange={(value) => onFilterChange("state", value)}
              />
              <FilterGroup
                title="Country"
                items={facets["location/country"]}
                selectedValue={activeFilters.country}
                onChange={(value) => onFilterChange("country", value)}
              />
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
