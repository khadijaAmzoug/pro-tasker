// File: src/pages/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

/**
 * ProjectDetails
 * - GET /projects/:id → project info
 * - GET /projects/:id/tasks → list tasks
 * - POST /projects/:id/tasks → create task
 */
export default function ProjectDetails() {
  const { id } = useParams();

  // loaders for project and tasks (independent states)
  const {
    request: fetchProject,
    data: project,
    loading: loadingProject,
    error: errorProject,
  } = useApi();

  const {
    request: fetchTasks,
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
  } = useApi();

  const {
    request: createTaskReq,
    loading: creatingTask,
    error: errorCreateTask,
  } = useApi();

  // form: create task
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // fetch on mount
  useEffect(() => {
    if (!id) return;
    fetchProject({ url: `/projects/${id}`, method: "GET" });
    fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });
  }, [id, fetchProject, fetchTasks]);

  // create new task
  const onCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTaskReq({
        url: `/projects/${id}/tasks`,
        method: "POST",
        data: { title, description, status: "To Do" },
      });
      // refresh list
      await fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });
      setTitle("");
      setDescription("");
    } catch {
      // error shown below
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Project header */}
        <div className="mb-6 bg-white border border-[#FFA07A] rounded-xl p-4">
          {loadingProject && <p>Loading project…</p>}
          {errorProject && (
            <p className="text-[#E57373]">Error: {errorProject}</p>
          )}
          {project && (
            <>
              <h1 className="text-2xl font-bold text-[#283593]">{project.name}</h1>
              {project.description && (
                <p className="text-[#283593] opacity-80 mt-1">
                  {project.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Create task form */}
        <form
          onSubmit={onCreateTask}
          className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4"
        >
          <h2 className="text-lg font-semibold text-[#283593]">Create Task</h2>
          <div>
            <label className="block text-sm mb-1 text-[#283593]">Title</label>
            <input
              className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#283593]">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={3}
            />
          </div>

          {errorCreateTask && (
            <p className="text-[#E57373] text-sm">Error: {errorCreateTask}</p>
          )}

          <button
            type="submit"
            disabled={creatingTask}
            className="px-4 py-2 rounded-md font-semibold text-white bg-[#FFA07A] hover:bg-[#FF8C5A] disabled:opacity-60 transition-colors"
          >
            {creatingTask ? "Creating..." : "Add Task"}
          </button>
        </form>

        {/* Tasks list */}
        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-3">Tasks</h2>

          {loadingTasks && <p>Loading tasks…</p>}
          {errorTasks && <p className="text-[#E57373]">Error: {errorTasks}</p>}

          {!loadingTasks &&
            !errorTasks &&
            Array.isArray(tasks) &&
            tasks.length === 0 && (
              <p className="text-sm text-[#283593]">
                No tasks yet. Create your first one!
              </p>
            )}

          <ul className="space-y-2">
            {Array.isArray(tasks) &&
              tasks.map((t) => (
                <li
                  key={t._id || t.id}
                  className="border border-[#4DD0E1] rounded-md p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#283593]">{t.title}</p>
                      {t.description && (
                        <p className="text-sm text-[#283593] opacity-80">
                          {t.description}
                        </p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#F5E1A4] text-[#283593]">
                        {t.status || "To Do"}
                      </span>
                    </div>
                    {/* مكان للأزرار لاحقًا: update status / delete */}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
