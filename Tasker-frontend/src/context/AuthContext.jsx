import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Derived flag
  const isAuthenticated = !!token;

  // Login: save token & user
  const login = (newToken, newUser) => {
    console.log("✅ AuthContext login called", { newToken, newUser });
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Logout: clear both
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Cross-tab sync (optional)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token" || e.key === "user") {
        const nextToken = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        setToken(nextToken);
        try {
          setUser(rawUser ? JSON.parse(rawUser) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
