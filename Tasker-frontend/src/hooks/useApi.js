import { useCallback, useState } from "react";
import axiosInstance from "../api/axios";

/**
 * Generic API hook
 * - request(config): performs axios request
 * - Returns { request, data, loading, error, reset }
 */
export default function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // config = { url, method, data, params, headers, ... }
  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.request(config);
      setData(res.data);
      return res.data; // let caller use the response directly
    } catch (err) {
      setError(err.message); // message normalized in interceptor
      throw err; // rethrow so caller can handle
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { request, data, loading, error, reset };
}
