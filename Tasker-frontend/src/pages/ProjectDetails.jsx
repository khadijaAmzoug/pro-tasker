// File: src/pages/ProjectDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";

export default function ProjectDetails() {
  const { id } = useParams();

  // Fetch project info
  const {
    request: fetchProject,
    data: project,
    loading: loadingProject,
    error: errorProject,
  } = useApi();

  // Fetch tasks
  const {
    request: fetchTasks,
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
  } = useApi();

  // Actions
  const { request: createTaskReq, loading: creatingTask, error: errorCreateTask } = useApi();
  const { request: updateTaskReq, loading: updatingTask, error: errorUpdateTask } = useApi();
  const { request: deleteTaskReq, loading: deletingTask, error: errorDeleteTask } = useApi();
  const { request: inviteReq, loading: inviting, error: inviteError } = useApi();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOk, setInviteOk] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchProject({ url: `/projects/${id}`, method: "GET" });
    fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });
  }, [id, fetchProject, fetchTasks]);

  const refreshProject = () => fetchProject({ url: `/projects/${id}`, method: "GET" });
  const refreshTasks = () => fetchTasks({ url: `/projects/${id}/tasks`, method: "GET" });

  // Create new task
  const onCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTaskReq({
      url: `/projects/${id}/tasks`,
      method: "POST",
      data: { title, description },
    });
    setTitle("");
    setDescription("");
    await refreshTasks();
  };

  // Start editing task
  const startEdit = (t) => {
    setEditId(t._id || t.id);
    setEditTitle(t.title || "");
    setEditDesc(t.description || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
  };

  // Save updated task
  const saveEdit = async () => {
    if (!editId || !editTitle.trim()) return;
    await updateTaskReq({
      url: `/tasks/${editId}`, // ✅ PATCH URL is now correct
      method: "PUT",
      data: { title: editTitle, description: editDesc },
    });
    cancelEdit();
    await refreshTasks();
  };

  // Change task status
  const onUpdateStatus = async (taskId, nextStatus) => {
    await updateTaskReq({
      url: `/tasks/${taskId}`, // ✅ PATCH URL is now correct
      method: "PUT",
      data: { status: nextStatus },
    });
    await refreshTasks();
  };

  // Delete a task
  const onDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    await deleteTaskReq({
      url: `/tasks/${taskId}`, // ✅ DELETE URL is now correct
      method: "DELETE",
    });
    await refreshTasks();
  };

  // Invite collaborator
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
    await refreshProject();
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

  const projectTitle = project?.title || project?.name;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Project Info */}
        <div className="mb-6 bg-white border border-[#FFA07A] rounded-xl p-4">
          {loadingProject && <p>Loading project…</p>}
          {errorProject && <p className="text-[#E57373]">Error: {errorProject}</p>}
          {project && (
            <>
              <h1 className="text-2xl font-bold text-[#283593]">{projectTitle}</h1>
              {project.description && (
                <p className="text-[#283593] opacity-80 mt-1">{project.description}</p>
              )}
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

        {/* Invite Form */}
        <form onSubmit={onInvite} className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593]">Invite collaborator</h2>
          <input
            type="email"
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          {inviteError && <p className="text-[#E57373] text-sm">Error: {inviteError}</p>}
          {inviteOk && <p className="text-[#66BB6A] text-sm">{inviteOk}</p>}
          <button
            type="submit"
            disabled={inviting}
            className="px-4 py-2 text-white bg-[#FFA07A] hover:bg-[#FF8C5A] rounded-md"
          >
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </form>

        {/* Create Task Form */}
        <form onSubmit={onCreateTask} className="mb-6 space-y-3 bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593]">Create Task</h2>
          <input
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <textarea
            className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            rows={3}
          />
          {errorCreateTask && <p className="text-[#E57373] text-sm">Error: {errorCreateTask}</p>}
          <button
            type="submit"
            disabled={creatingTask}
            className="px-4 py-2 text-white bg-[#FFA07A] hover:bg-[#FF8C5A] rounded-md"
          >
            {creatingTask ? "Creating..." : "Add Task"}
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white border border-[#FFA07A] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#283593] mb-3">Tasks</h2>

          {loadingTasks && <p>Loading tasks…</p>}
          {errorTasks && <p className="text-[#E57373]">Error: {errorTasks}</p>}
          {errorUpdateTask && <p className="text-[#E57373]">Update error: {errorUpdateTask}</p>}
          {errorDeleteTask && <p className="text-[#E57373]">Delete error: {errorDeleteTask}</p>}
          {!loadingTasks && tasks?.length === 0 && <p>No tasks yet. Create one!</p>}

          <ul className="space-y-2">
            {tasks?.map((t) => {
              const tid = t._id || t.id;
              const isEditing = editId === tid;

              return (
                <li key={tid} className="border border-[#4DD0E1] rounded-md p-3">
                  <div className="flex flex-wrap justify-between gap-3">
                    {!isEditing ? (
                      <div className="min-w-[220px]">
                        <p className="font-semibold text-[#283593]">{t.title}</p>
                        {t.description && <p className="text-sm text-[#283593] opacity-80">{t.description}</p>}
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${statusBadge(t.status)}`}>
                          {t.status || "To Do"}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full max-w-xl space-y-2">
                        <input
                          className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Task title"
                          required
                        />
                        <textarea
                          className="w-full px-3 py-2 border border-[#4DD0E1] rounded-md"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Short description"
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <select
                            className="border border-[#4DD0E1] rounded-md px-2 py-1 text-sm"
                            value={t.status || "To Do"}
                            onChange={(e) => onUpdateStatus(tid, e.target.value)}
                            disabled={updatingTask || deletingTask}
                          >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                          </select>
                          <button onClick={() => startEdit(t)} className="px-3 py-1.5 rounded-md text-sm bg-[#4DD0E1] text-[#283593] hover:opacity-90">
                            Edit
                          </button>
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
                            className="px-3 py-1.5 rounded-md border border-[#4DD0E1] text-[#283593] hover:bg-[#F5E1A4]"
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
