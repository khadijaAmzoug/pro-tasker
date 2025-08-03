// File: src/pages/Projects.jsx
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

/**
 * Projects Page
 * - GET /projects → list user projects
 * - POST /projects → create a new project
 */
export default function Projects() {
  // list fetcher
  const {
    request: fetchReq,
    data: list,
    loading: loadingList,
    error: errorList,
  } = useApi();

  // create fetcher (separate to have independent loading/error)
  const {
    request: createReq,
    loading: loadingCreate,
    error: errorCreate,
  } = useApi();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // load projects on mount
  useEffect(() => {
    fetchReq({ url: "/projects", method: "GET" });
  }, [fetchReq]);

  // handle create
  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createReq({
        url: "/projects",
        method: "POST",
        data: { name, description },
      });
      // refresh list
      await fetchReq({ url: "/projects", method: "GET" });
      // reset form
      setName("");
      setDescription("");
    } catch {
      // error displayed below
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#283593] mb-4">Projects</h1>

        {/* Create form */}
        <form onSubmit={onCreate} className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4">
          <div>
            <label className="block text-sm mb-1 text-[#283593]">Name</label>
            <input
              className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#283593]">Description (optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={3}
            />
          </div>
          {errorCreate && (
            <p className="text-[#E57373] text-sm">Error: {errorCreate}</p>
          )}
          <button
            type="submit"
            disabled={loadingCreate}
            className="px-4 py-2 rounded-md font-semibold text-white bg-[#FFA07A] hover:bg-[#FF8C5A] disabled:opacity-60 transition-colors"
          >
            {loadingCreate ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* Projects list */}
        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-3">Your projects</h2>

          {loadingList && <p>Loading...</p>}
          {errorList && <p className="text-[#E57373]">Error: {errorList}</p>}

          {!loadingList && !errorList && Array.isArray(list) && list.length === 0 && (
            <p className="text-sm text-[#283593]">No projects yet. Create your first one!</p>
          )}

          <ul className="space-y-2">
            {Array.isArray(list) &&
              list.map((p) => (
                <li
                  key={p._id || p.id}
                  className="border border-[#4DD0E1] rounded-md p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#283593]">{p.name}</p>
                      {p.description && (
                        <p className="text-sm text-[#283593] opacity-80">
                          {p.description}
                        </p>
                      )}
                    </div>
                    {/* later: add View/Edit/Delete actions */}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
