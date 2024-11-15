import { useState, useEffect } from 'react';
import { getFacets } from '../services/api';
import { Facets } from '../types/api';

export function useFacets() {
  const [facets, setFacets] = useState<Facets>({
    stages: [],
    regions: [],
    city: [],
    country: [],
    state: [],
    categories: [],
    sectors: [],
    geographical_focus: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFacets = async () => {
      setLoading(true);
      try {
        const data = await getFacets();
        setFacets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load filters');
      } finally {
        setLoading(false);
      }
    };

    loadFacets();
  }, []);

  return { facets, loading, error };
}