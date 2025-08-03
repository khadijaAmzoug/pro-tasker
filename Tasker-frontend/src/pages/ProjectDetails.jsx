import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

/**
 * ProjectDetails
 * - GET /projects/:id → project info
 * - GET /projects/:id/tasks → list tasks
 * - POST /projects/:id/tasks → create task
 * - PATCH /projects/:id/tasks/:taskId → update task (title/description/status)
 * - DELETE /projects/:id/tasks/:taskId → delete task
 * - POST /projects/:id/invite → invite collaborator (owner-only)
 */
export default function ProjectDetails() {
  const { id } = useParams();

  // load project
  const {
    request: fetchProject,
    data: project,
    loading: loadingProject,
    error: errorProject,
  } = useApi();

  // load tasks
  const {
    request: fetchTasks,
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
  } = useApi();

  // create / update / delete loaders
  const { request: createTaskReq, loading: creatingTask, error: errorCreateTask } = useApi();
  const { request: updateTaskReq, loading: updatingTask, error: errorUpdateTask } = useApi();
  const { request: deleteTaskReq, loading: deletingTask, error: errorDeleteTask } = useApi();

  // invite loader
  const { request: inviteReq, loading: inviting, error: inviteError } = useApi();

  // create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // inline edit state for tasks
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOk, setInviteOk] = useState("");

  // fetch on mount
  useEffect(() => {
    if (!id) return;
    fetchProject({ url: `/projects/${id}`, method: "GET" });
    fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });
  }, [id, fetchProject, fetchTasks]);

  const refreshProject = () => fetchProject({ url: `/projects/${id}`, method: "GET" });
  const refreshTasks = () => fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });

  // create task
  const onCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTaskReq({
      url: `/projects/${id}/tasks`,
      method: "POST",
      data: { title, description, status: "To Do" },
    });
    setTitle("");
    setDescription("");
    await refreshTasks();
  };

  // start edit
  const startEdit = (t) => {
    setEditId(t._id || t.id);
    setEditTitle(t.title || "");
    setEditDesc(t.description || "");
  };

  // cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
  };

  // save edit (title/description)
  const saveEdit = async () => {
    if (!editId || !editTitle.trim()) return;
    await updateTaskReq({
      url: `/projects/${id}/tasks/${editId}`,
      method: "PATCH",
      data: { title: editTitle, description: editDesc },
    });
    cancelEdit();
    await refreshTasks();
  };

  // update only status
  const onUpdateStatus = async (taskId, nextStatus) => {
    await updateTaskReq({
      url: `/projects/${id}/tasks/${taskId}`,
      method: "PATCH",
      data: { status: nextStatus },
    });
    await refreshTasks();
  };

  // delete
  const onDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    await deleteTaskReq({ url: `/projects/${id}/tasks/${taskId}`, method: "DELETE" });
    await refreshTasks();
  };

  // invite collaborator (owner-only on backend)
  const onInvite = async (e) => {
    e.preventDefault();
    setInviteOk("");
    if (!inviteEmail.trim()) return;
    await inviteReq({
      url: `/projects/${id}/invite`,
      method: "POST",
      data: { email: inviteEmail },
    });
    setInviteOk("Invitation sent (collaborator added).");
    setInviteEmail("");
    // optional: refresh project to see collaborators list if backend populates
    await refreshProject();
  };

  // badge color
  const statusBadge = (status) => {
    switch ((status || "To Do").toLowerCase()) {
      case "in progress":
        return "bg-[#4DD0E1] text-[#283593]"; // Aqua Breeze
      case "done":
        return "bg-[#66BB6A] text-white"; // Palm Leaf Green
      default:
        return "bg-[#F5E1A4] text-[#283593]"; // Soft Sand
    }
  };

  // project title compatibility (title or name)
  const projectTitle = project?.title || project?.name;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Project header */}
        <div className="mb-6 bg-white border border-[#FFA07A] rounded-xl p-4">
          {loadingProject && <p>Loading project…</p>}
          {errorProject && <p className="text-[#E57373]">Error: {errorProject}</p>}
          {project && (
            <>
              <h1 className="text-2xl font-bold text-[#283593]">{projectTitle}</h1>
              {project.description && (
                <p className="text-[#283593] opacity-80 mt-1">{project.description}</p>
              )}

              {/* Optional list of collaborators if backend populates them */}
              {Array.isArray(project.collaborators) && project.collaborators.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-[#283593] font-semibold">Collaborators:</p>
                  <ul className="list-disc pl-5 text-sm text-[#283593] opacity-80">
                    {project.collaborators.map((c) => (
                      <li key={c._id || c.id}>{c.name || c.email || String(c)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Invite collaborator */}
        <form
          onSubmit={onInvite}
          className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4"
        >
          <h2 className="text-lg font-semibold text-[#283593]">Invite collaborator</h2>
          <input
            type="email"
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {inviteError && <p className="text-[#E57373] text-sm">Error: {inviteError}</p>}
          {inviteOk && <p className="text-[#66BB6A] text-sm">{inviteOk}</p>}
          <button
            type="submit"
            disabled={inviting}
            className="px-4 py-2 rounded-md font-semibold text-white bg-[#FFA07A] hover:bg-[#FF8C5A] disabled:opacity-60 transition-colors"
          >
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </form>

        {/* Create task */}
        <form
          onSubmit={onCreateTask}
          className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4"
        >
          <h2 className="text-lg font-semibold text-[#283593]">Create Task</h2>
          <input
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <textarea
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            rows={3}
          />
          {errorCreateTask && <p className="text-[#E57373] text-sm">Error: {errorCreateTask}</p>}
          <button
            type="submit"
            disabled={creatingTask}
            className="px-4 py-2 rounded-md font-semibold text-white bg-[#FFA07A] hover:bg-[#FF8C5A] disabled:opacity-60 transition-colors"
          >
            {creatingTask ? "Creating..." : "Add Task"}
          </button>
        </form>

        {/* Tasks */}
        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-3">Tasks</h2>

          {loadingTasks && <p>Loading tasks…</p>}
          {errorTasks && <p className="text-[#E57373]">Error: {errorTasks}</p>}
          {errorUpdateTask && <p className="text-[#E57373]">Update error: {errorUpdateTask}</p>}
          {errorDeleteTask && <p className="text-[#E57373]">Delete error: {errorDeleteTask}</p>}

          {!loadingTasks && !errorTasks && Array.isArray(tasks) && tasks.length === 0 && (
            <p className="text-sm text-[#283593]">No tasks yet. Create your first one!</p>
          )}

          <ul className="space-y-2">
            {Array.isArray(tasks) &&
              tasks.map((t) => {
                const tid = t._id || t.id;
                const isEditing = editId === tid;

                return (
                  <li key={tid} className="border border-[#4DD0E1] rounded-md p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      {/* left: view or edit */}
                      {!isEditing ? (
                        <div className="min-w-[220px]">
                          <p className="font-semibold text-[#283593]">{t.title}</p>
                          {t.description && (
                            <p className="text-sm text-[#283593] opacity-80">{t.description}</p>
                          )}
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${statusBadge(
                              t.status
                            )}`}
                          >
                            {t.status || "To Do"}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full max-w-xl space-y-2">
                          <input
                            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Task title"
                            required
                          />
                          <textarea
                            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Short description"
                            rows={3}
                          />
                        </div>
                      )}

                      {/* right: actions */}
                      <div className="flex items-center gap-2">
                        {!isEditing ? (
                          <>
                            {/* Status select */}
                            <select
                              className="border border-[#4DD0E1] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
                              value={t.status || "To Do"}
                              onChange={(e) => onUpdateStatus(tid, e.target.value)}
                              disabled={updatingTask || deletingTask}
                            >
                              <option>To Do</option>
                              <option>In Progress</option>
                              <option>Done</option>
                            </select>

                            {/* Edit */}
                            <button
                              onClick={() => startEdit(t)}
                              className="px-3 py-1.5 rounded-md text-sm bg-[#4DD0E1] text-[#283593] hover:opacity-90"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => onDeleteTask(tid)}
                              disabled={updatingTask || deletingTask}
                              className="px-3 py-1.5 rounded-md text-white text-sm bg-[#E57373] hover:opacity-90 disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={updatingTask}
                              className="px-3 py-1.5 rounded-md text-white bg-[#66BB6A] hover:opacity-90 disabled:opacity-60"
                            >
                              {updatingTask ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 rounded-md bg-white border border-[#4DD0E1] text-[#283593] hover:bg-[#F5E1A4]"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
