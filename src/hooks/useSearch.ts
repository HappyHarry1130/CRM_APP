import { useState, useCallback } from 'react';
import { search, aiSearch } from '../services/api';
import { VCContact } from '../types/api';

export function useSearch() {
  const [results, setResults] = useState<VCContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await search(query, type);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const performAISearch = useCallback(async (context: string, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiSearch(context, type);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during AI search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const performAISearch_MD = useCallback(async (context: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiSearch(context);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during AI search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, performSearch, performAISearch, performAISearch_MD };
}