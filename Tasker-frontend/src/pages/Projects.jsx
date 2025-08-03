import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

/**
 * Projects Page
 * - GET /projects → list
 * - POST /projects → create
 * - PATCH /projects/:id → update
 * - DELETE /projects/:id → delete
 */
export default function Projects() {
  // list loader
  const {
    request: fetchReq,
    data: list,
    loading: loadingList,
    error: errorList,
  } = useApi();

  // create loader
  const {
    request: createReq,
    loading: loadingCreate,
    error: errorCreate,
  } = useApi();

  // update loader
  const {
    request: updateReq,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useApi();

  // delete loader
  const {
    request: deleteReq,
    loading: loadingDelete,
    error: errorDelete,
  } = useApi();

  // create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // inline edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // load projects
  const reload = () => fetchReq({ url: "/projects", method: "GET" });
  useEffect(() => {
    reload();
  }, []); // eslint-disable-line

  // create
  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createReq({ url: "/projects", method: "POST", data: { name, description } });
    setName("");
    setDescription("");
    await reload();
  };

  // start edit
  const startEdit = (p) => {
    setEditId(p._id || p.id);
    setEditName(p.name || "");
    setEditDesc(p.description || "");
  };

  // cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
  };

  // save edit
  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    await updateReq({
      url: `/projects/${editId}`,
      method: "PATCH",
      data: { name: editName, description: editDesc },
    });
    cancelEdit();
    await reload();
  };

  // delete
  const onDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await deleteReq({ url: `/projects/${id}`, method: "DELETE" });
    await reload();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#283593] mb-4">Projects</h1>

        {/* Create form */}
        <form onSubmit={onCreate} className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593]">Create Project</h2>
          <input
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {errorCreate && <p className="text-[#E57373] text-sm">Error: {errorCreate}</p>}
          <button
            type="submit"
            disabled={loadingCreate}
            className="px-4 py-2 rounded-md font-semibold text-white bg-[#FFA07A] hover:bg-[#FF8C5A] disabled:opacity-60 transition-colors"
          >
            {loadingCreate ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* List */}
        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-3">Your projects</h2>
          {loadingList && <p>Loading...</p>}
          {errorList && <p className="text-[#E57373]">Error: {errorList}</p>}
          {errorUpdate && <p className="text-[#E57373]">Update error: {errorUpdate}</p>}
          {errorDelete && <p className="text-[#E57373]">Delete error: {errorDelete}</p>}

          {!loadingList && !errorList && Array.isArray(list) && list.length === 0 && (
            <p className="text-sm text-[#283593]">No projects yet. Create your first one!</p>
          )}

          <ul className="space-y-2">
            {Array.isArray(list) &&
              list.map((p) => {
                const pid = p._id || p.id;
                const isEditing = editId === pid;

                return (
                  <li key={pid} className="border border-[#4DD0E1] rounded-md p-3">
                    {/* View mode */}
                    {!isEditing && (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/projects/${pid}`}
                            className="font-semibold text-[#283593] underline decoration-[#4DD0E1]"
                          >
                            {p.name}
                          </Link>
                          {p.description && (
                            <p className="text-sm text-[#283593] opacity-80">{p.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-1.5 rounded-md text-sm bg-[#4DD0E1] text-[#283593] hover:opacity-90"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(pid)}
                            disabled={loadingDelete}
                            className="px-3 py-1.5 rounded-md text-sm text-white bg-[#E57373] hover:opacity-90 disabled:opacity-60"
                          >
                            {loadingDelete ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit mode */}
                    {isEditing && (
                      <div className="space-y-2">
                        <input
                          className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Project name"
                          required
                        />
                        <textarea
                          className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Short description"
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={loadingUpdate}
                            className="px-3 py-1.5 rounded-md text-white bg-[#66BB6A] hover:opacity-90 disabled:opacity-60"
                          >
                            {loadingUpdate ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 rounded-md bg-white border border-[#4DD0E1] text-[#283593] hover:bg-[#F5E1A4]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
