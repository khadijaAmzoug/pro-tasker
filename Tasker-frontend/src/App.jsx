import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // wrap the app
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ← NEW

// Simple dashboard placeholder
function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <p>Welcome to Pro-Tasker 🎉</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to /login (adjust as you like) */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ← NEW */}

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* later: /projects, /projects/:id, etc. */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
