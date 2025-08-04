import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";   // calls POST /users/login
import { useAuth } from "../context/AuthContext"; // has isAuthenticated
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin("/api/users/login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟡 handleSubmit started", { email, password });

      console.log("Submitting login..."); 
    try {
      // backend returns { user, token }
      await login({ email, password }); // saves in context + localStorage
       console.log("🟢 login success, navigating...");
      navigate("/dashboard"); // no reload needed
    } catch {
          console.log("🔴 login failed");

      // error already handled in hook → `error`
    }
  };

  return (
    <div className="bg-[#F5E1A4] flex justify-center py-12"> {/* Soft Sand background */}
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-[#FFA07A]">
        <h2 className="text-2xl font-bold text-[#283593] mb-6 text-center">
          Login to Pro-Tasker
        </h2>

        {error && <p className="text-[#E57373] text-sm mb-4 text-center">Error: {error}</p>}
        {isAuthenticated && <p className="text-[#66BB6A] text-sm mb-4 text-center">Logged in</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white py-2 rounded-md font-semibold disabled:opacity-60 transition-colors duration-300"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center text-[#283593] mt-4">
  Don't have an account?{" "}
  <Link to="/register" className="underline decoration-[#4DD0E1]">
    Sign up
  </Link>
</p>
      </div>
    </div>
  );
}
