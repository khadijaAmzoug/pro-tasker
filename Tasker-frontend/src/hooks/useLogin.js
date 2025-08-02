import { useCallback } from "react";
import useApi from "./useApi";
import { useAuth } from "../context/AuthContext";

/**
 * useLogin
 * - Calls the backend login endpoint
 * - On success, saves user/token via AuthContext.login
 * - Returns { login, loading, error, reset }
 */
export default function useLogin(endpoint = "/users/login") {
  const { request, loading, error, reset } = useApi();
  const { login: setAuthLogin } = useAuth();

  const login = useCallback(
    async ({ email, password }) => {
      // Send credentials to API
      const data = await request({
        url: endpoint,
        method: "POST",
        data: { email, password },
      });

      // Expecting: { user: {...}, token: "..." }
      if (!data?.token || !data?.user) {
        throw new Error("Unexpected response format");
      }

      // Save into global auth (localStorage + state)
      setAuthLogin(data.token, data.user);

      return data; // let caller navigate, etc.
    },
    [endpoint, request, setAuthLogin]
  );

  return { login, loading, error, reset };
}
