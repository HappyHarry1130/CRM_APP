import React from 'react';
import { FacetGroup } from '../../types/api';

interface FilterGroupProps {
  title: string;
  items: FacetGroup[];
  selectedValue?: string;
  onChange: (value: string) => void;
}

export function FilterGroup({ title, items, selectedValue, onChange }: FilterGroupProps) {
  if (!items?.length) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.value} className="flex items-center">
            <input
              type="radio"
              name={title}
              value={item.value}
              checked={selectedValue === item.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-600">
              {item.value} ({item.count})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}