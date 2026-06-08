import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Plus, Clock, ToggleLeft, ToggleRight } from "lucide-react";

import {
    getAllPositions,
    createPosition,
    updatePosition,
    deletePosition,
} from "../../services/positionService";

// ─── Helpers ──────────────────────────────────────────────────
const formatDate = (dt) => {
    if (!dt) return "No end time set";
    return new Date(dt).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

// datetime-local input needs "YYYY-MM-DDTHH:mm" format
const toInputValue = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const inputCls =
    "w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-cyan-500 transition text-slate-800 bg-white";

// ─── Toast ────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
    <div
        className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium ${
            type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
    >
        {message}
    </div>
);

// ─── Delete Confirm ───────────────────────────────────────────
const ConfirmDialog = ({ position, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Position</h3>
            <p className="text-slate-500 mb-6">
                Are you sure you want to delete the{" "}
                <span className="font-semibold text-slate-800">{position.title}</span>{" "}
                position? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

// ─── Position Form Modal (shared for Add + Edit) ──────────────
const EMPTY_FORM = {
    title: "",
    description: "",
    maxVotesAllowed: 1,
    active: true,
    endTime: "",
};

const PositionModal = ({ initial, onSave, onClose, saving, mode }) => {

    const [form, setForm] = useState(
        initial
            ? {
                  title: initial.title || "",
                  description: initial.description || "",
                  maxVotesAllowed: initial.maxVotesAllowed || 1,
                  active: initial.active ?? true,
                  endTime: toInputValue(initial.endTime),
              }
            : EMPTY_FORM
    );

    const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            maxVotesAllowed: Number(form.maxVotesAllowed),
            endTime: form.endTime || null,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            {mode === "add" ? "Add Position" : "Edit Position"}
                        </h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {mode === "add"
                                ? "Create a new voting position"
                                : "Update position details"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Position Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. President, Secretary"
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            required
                            className={inputCls}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Brief description of this position…"
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            rows={3}
                            className={`${inputCls} resize-none`}
                        />
                    </div>

                    {/* Max Votes */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Maximum Votes Allowed *
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={form.maxVotesAllowed}
                            onChange={(e) => set("maxVotesAllowed", e.target.value)}
                            required
                            className={inputCls}
                        />
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Poll End Time
                        </label>
                        <input
                            type="datetime-local"
                            value={form.endTime}
                            onChange={(e) => set("endTime", e.target.value)}
                            className={inputCls}
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <p className="font-semibold text-slate-700">Active</p>
                            <p className="text-sm text-slate-400">
                                Users can vote on this position when active
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => set("active", !form.active)}
                            className="transition"
                        >
                            {form.active
                                ? <ToggleRight size={38} className="text-cyan-500" />
                                : <ToggleLeft size={38} className="text-slate-400" />
                            }
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition disabled:opacity-60"
                        >
                            {saving
                                ? mode === "add" ? "Adding…" : "Saving…"
                                : mode === "add" ? "Add Position" : "Save Changes"
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// ─── Position Card ─────────────────────────────────────────────
const PositionCard = ({ position, onEdit, onDelete }) => (
    <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col gap-3 hover:shadow-xl transition">

        {/* Title + active badge */}
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-800">
                {position.title}
            </h2>
            <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    position.active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                }`}
            >
                {position.active ? "Active" : "Inactive"}
            </span>
        </div>

        {/* Description */}
        {position.description && (
            <p className="text-slate-500 text-sm leading-relaxed">
                {position.description}
            </p>
        )}

        {/* Max votes */}
        <div className="mt-2">
            <p className="text-slate-400 text-sm">Maximum Votes Allowed</p>
            <p className="text-5xl font-bold text-cyan-500 mt-1">
                {position.maxVotesAllowed}
            </p>
        </div>

        {/* End time */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <Clock size={14} />
            <span>{formatDate(position.endTime)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
            <button
                onClick={() => onEdit(position)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition flex-1 justify-center"
            >
                <Pencil size={15} />
                Edit Position
            </button>
            <button
                onClick={() => onDelete(position)}
                className="bg-red-100 hover:bg-red-200 text-red-600 p-2.5 rounded-xl transition"
                title="Delete position"
            >
                <Trash2 size={17} />
            </button>
        </div>

    </div>
);

// ─── Main Page ────────────────────────────────────────────────
const ManagePositions = () => {

    const [positions, setPositions]       = useState([]);
    const [loading, setLoading]           = useState(true);
    const [saving, setSaving]             = useState(false);

    const [showAdd, setShowAdd]           = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [toast, setToast]               = useState(null);

    // ── Fetch ─────────────────────────────────────────────────
    useEffect(() => { fetchPositions(); }, []);

    const fetchPositions = async () => {
        try {
            setLoading(true);
            setPositions(await getAllPositions());
        } catch {
            showToast("Failed to load positions", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Create ────────────────────────────────────────────────
    const handleCreate = async (form) => {
        try {
            setSaving(true);
            await createPosition(form);
            await fetchPositions();          // refresh list
            setShowAdd(false);
            showToast("Position added successfully");
        } catch {
            showToast("Failed to add position", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Update ────────────────────────────────────────────────
    const handleUpdate = async (form) => {
        try {
            setSaving(true);
            await updatePosition(editTarget.id, form);
            await fetchPositions();
            setEditTarget(null);
            showToast("Position updated successfully");
        } catch {
            showToast("Failed to update position", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────
    const handleDelete = async () => {
        try {
            await deletePosition(deleteTarget.id);
            setPositions((prev) =>
                prev.filter((p) => p.id !== deleteTarget.id)
            );
            setDeleteTarget(null);
            showToast("Position deleted successfully");
        } catch {
            showToast("Failed to delete position", "error");
        }
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <div>

            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-5xl font-bold text-slate-800">
                        Positions
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Configure voting positions
                    </p>
                </div>

                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold transition shadow-sm"
                >
                    <Plus size={20} />
                    Add Position
                </button>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex justify-center items-center py-24 text-slate-400">
                    Loading positions…
                </div>
            ) : positions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                    <p className="text-lg">No positions created yet.</p>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="text-cyan-500 hover:underline font-medium"
                    >
                        + Add your first position
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {positions.map((pos) => (
                        <PositionCard
                            key={pos.id}
                            position={pos}
                            onEdit={setEditTarget}
                            onDelete={setDeleteTarget}
                        />
                    ))}
                </div>
            )}

            {/* ── Modals ── */}
            {showAdd && (
                <PositionModal
                    mode="add"
                    onSave={handleCreate}
                    onClose={() => setShowAdd(false)}
                    saving={saving}
                />
            )}

            {editTarget && (
                <PositionModal
                    mode="edit"
                    initial={editTarget}
                    onSave={handleUpdate}
                    onClose={() => setEditTarget(null)}
                    saving={saving}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    position={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} />}

        </div>
    );
};

export default ManagePositions;
