import { useState, useCallback } from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url: string, method: string = 'GET', body: any = null, headers: any = {}, blob: boolean = false) => {
      setLoading(true);
      try {
        if (body) {
          body = JSON.stringify(body);
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, { method, body, headers });
        setLoading(false);
        if (blob) {
          return response.arrayBuffer();
        }
        const data = await response.json();
        const parsedData = {...data, statusCode: response.status}

        return parsedData;
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );
  const clearError = () => setError(null);

  return { loading, request, error, clearError };
};