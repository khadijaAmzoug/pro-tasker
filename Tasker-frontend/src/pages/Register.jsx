
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../hooks/useApi";

/**
 * Register Page
 * - Collects name/email/password
 * - Calls POST /users/register
 * - On success → navigate to /login
 */
export default function Register() {
  const { request, loading, error, reset } = useApi();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    reset();

    // Simple client-side validation
    if (password !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      
      await request({
        url: "/api/users/register",
        method: "POST",
        data: { name, email, password },
      });

      // After successful registration, go to login page
      navigate("/login");
    } catch (_) {
      // error message already handled in hook (error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F5E1A4]">
      {/* Card */}
      <div className="w-full max-w-md bg-white border border-[#FFA07A] rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#283593] mb-6">
          Create your Pro-Tasker account
        </h1>

        {/* Errors */}
        {localError && (
          <p className="text-[#E57373] text-sm mb-3 text-center">{localError}</p>
        )}
        {error && (
          <p className="text-[#E57373] text-sm mb-3 text-center">Error: {error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[#283593]">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#283593]">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#283593]">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#283593]">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white py-2 rounded-md font-semibold disabled:opacity-60 transition-colors duration-300"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Helper link */}
        <p className="text-sm text-center text-[#283593] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline decoration-[#4DD0E1]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
