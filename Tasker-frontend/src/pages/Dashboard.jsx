import { useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { request, data: projects, loading, error } = useApi();

  useEffect(() => {
    request({ url: "/api/projects", method: "GET" });
  }, []); // fetch once on load

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#283593] mb-4">Dashboard</h1>

        <p className="text-[#283593] mb-6">Welcome to Pro-Tasker 🎉</p>

        <Link
          to="/projects"
          className="inline-block mb-4 px-5 py-2 rounded-md font-semibold bg-[#FFA07A] text-white hover:bg-[#FF8C5A]"
        >
          ➕ Manage Your Projects
        </Link>

        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-2">Your Projects</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-[#E57373]">Error: {error}</p>}

          {Array.isArray(projects) && projects.length === 0 && (
            <p className="text-sm text-[#283593]">No projects yet. Start by creating one!</p>
          )}

          <ul className="space-y-2">
            {Array.isArray(projects) &&
              projects.map((p) => (
                <li key={p._id} className="border border-[#4DD0E1] rounded-md p-3">
                  <Link
                    to={`/projects/${p._id}`}
                    className="font-semibold text-[#283593] underline decoration-[#4DD0E1]"
                  >
                    {p.name}
                  </Link>
                  {p.description && (
                    <p className="text-sm text-[#283593] opacity-80">{p.description}</p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
