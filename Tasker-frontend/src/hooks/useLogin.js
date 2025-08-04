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
      console.log("✅ Login response:", data);

      // Expecting: { user: {...}, token: "..." }
      if (!data?.token || !data?._id) {
        throw new Error("Unexpected response format");
      }

      // Save into global auth (localStorage + state)
      console.log("✅ Saving token and user to localStorage", data);

      setAuthLogin(data.token, {
  _id: data._id,
  name: data.name,
  email: data.email,
});

      return data; // let caller navigate, etc.
    },
    [endpoint, request, setAuthLogin]
  );

  return { login, loading, error, reset };
}
