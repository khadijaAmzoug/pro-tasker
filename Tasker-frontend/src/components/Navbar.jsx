import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // clear token/user (AuthContext)
    navigate("/login");  // go back to login
  };

  return (
    <header className="w-full bg-white border-b border-[#FFA07A]">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[#4DD0E1]" />
          <h1 className="text-lg font-bold text-[#283593]">Pro-Tasker</h1>
        </Link>

        {/* Links (add more as needed) */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm text-[#283593] hover:underline decoration-[#4DD0E1]"
          >
            Dashboard
          </Link>
          {/* Example future links:
          <Link to="/projects" className="text-sm text-[#283593] hover:underline decoration-[#4DD0E1]">
            Projects
          </Link>
          */}
        </div>

        {/* Right side: user + logout */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span className="text-sm text-[#283593]">
              {user?.name ? `Hi, ${user.name}` : "Logged in"}
            </span>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-white font-semibold bg-[#FFA07A] hover:bg-[#FF8C5A] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-md text-white font-semibold bg-[#4DD0E1] hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="h-1 w-full bg-[#F5E1A4]" />
    </header>
  );
}
