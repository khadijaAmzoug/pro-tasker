import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

/**
 * ProjectDetails
 * - GET /projects/:id → project info
 * - GET /projects/:id/tasks → list tasks
 * - POST /projects/:id/tasks → create task
 * - PATCH /projects/:id/tasks/:taskId → update task (status/title/description)
 * - DELETE /projects/:id/tasks/:taskId → delete task
 */
export default function ProjectDetails() {
  const { id } = useParams();

  // project loader
  const {
    request: fetchProject,
    data: project,
    loading: loadingProject,
    error: errorProject,
  } = useApi();

  // tasks loader
  const {
    request: fetchTasks,
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
  } = useApi();

  // create task
  const {
    request: createTaskReq,
    loading: creatingTask,
    error: errorCreateTask,
  } = useApi();

  // update task
  const {
    request: updateTaskReq,
    loading: updatingTask,
  } = useApi();

  // delete task
  const {
    request: deleteTaskReq,
    loading: deletingTask,
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

  // refresh tasks helper
  const refreshTasks = () =>
    fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });

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
      setTitle("");
      setDescription("");
      await refreshTasks();
    } catch {
      // error shown below
    }
  };

  // update task status (or other fields if needed)
  const onUpdateStatus = async (taskId, nextStatus) => {
    try {
      await updateTaskReq({
        url: `/projects/${id}/tasks/${taskId}`,
        method: "PATCH",
        data: { status: nextStatus }, // backend should accept partial update
      });
      await refreshTasks();
    } catch {
      // show handled by hook via console/UI if you add it
    }
  };

  // delete task
  const onDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTaskReq({
        url: `/projects/${id}/tasks/${taskId}`,
        method: "DELETE",
      });
      await refreshTasks();
    } catch {
      // handled by hook
    }
  };

  const statusBadge = (status) => {
    switch ((status || "To Do").toLowerCase()) {
      case "in progress":
        return "bg-[#4DD0E1] text-[#283593]"; 
      case "done":
        return "bg-[#66BB6A] text-white";
      default:
        return "bg-[#F5E1A4] text-[#283593]"; 
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
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* left: info */}
                    <div className="min-w-[200px]">
                      <p className="font-semibold text-[#283593]">{t.title}</p>
                      {t.description && (
                        <p className="text-sm text-[#283593] opacity-80">
                          {t.description}
                        </p>
                      )}
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${statusBadge(
                          t.status
                        )}`}
                      >
                        {t.status || "To Do"}
                      </span>
                    </div>

                    {/* right: actions */}
                    <div className="flex items-center gap-2">
                      {/* Status select */}
                      <select
                        className="border border-[#4DD0E1] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                        value={t.status || "To Do"}
                        onChange={(e) => onUpdateStatus(t._id || t.id, e.target.value)}
                        disabled={updatingTask || deletingTask}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteTask(t._id || t.id)}
                        disabled={updatingTask || deletingTask}
                        className="px-3 py-1.5 rounded-md text-white text-sm bg-[#E57373] hover:opacity-90 disabled:opacity-60 transition-opacity"
                        title="Delete task"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}