import React from 'react';
import { FilterGroup } from './FilterGroup';
import { useFacets } from '../../hooks/useFacets';
import { FilterState } from '../../types/api';
import { X } from 'lucide-react';

interface FilterPanelProps {
  activeFilters: FilterState;
  onFilterChange: (category: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  activeFilters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const { facets, loading } = useFacets();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 bg-white p-6 rounded-lg shadow-md">
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
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        title="Investment Stage"
        items={facets.stages}
        selectedValue={activeFilters.stage}
        onChange={(value) => onFilterChange('stage', value)}
      />

      <FilterGroup
        title="Region"
        items={facets.regions}
        selectedValue={activeFilters.region}
        onChange={(value) => onFilterChange('region', value)}
      />

      <FilterGroup
        title="Sector"
        items={facets.sectors}
        selectedValue={activeFilters.sector}
        onChange={(value) => onFilterChange('sector', value)}
      />

      <FilterGroup
        title="Location"
        items={facets.geographical_focus}
        selectedValue={activeFilters.location}
        onChange={(value) => onFilterChange('location', value)}
      />
    </div>
  );
}