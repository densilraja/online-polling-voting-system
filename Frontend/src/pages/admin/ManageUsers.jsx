import { useEffect, useState } from "react";
import {
    Pencil, Trash2, ShieldOff, ShieldCheck,
    Search, X, UserPlus, Eye, EyeOff,
} from "lucide-react";

import {
    getAllUsers,
    createUser,
    updateUser,
    blockUser,
    unblockUser,
    deleteUser,
} from "../../services/userService";

// ─── Badges ──────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
    <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            role === "ADMIN"
                ? "bg-violet-100 text-violet-700"
                : "bg-cyan-100 text-cyan-700"
        }`}
    >
        {role}
    </span>
);

const StatusBadge = ({ blocked }) => (
    <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            blocked
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
        }`}
    >
        {blocked ? "Blocked" : "Active"}
    </span>
);

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
const ConfirmDialog = ({ user, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete User</h3>
            <p className="text-slate-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">{user.name}</span>?
                This action cannot be undone.
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

// ─── Shared input style ───────────────────────────────────────
const inputCls =
    "w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-cyan-500 transition text-slate-800";

// ─── Create User Modal ────────────────────────────────────────
const CreateModal = ({ onSave, onClose, saving }) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });
    const [showPwd, setShowPwd] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[480px] shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            Create User
                        </h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                            Add a new USER or ADMIN account
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

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className={inputCls}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. john@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={inputCls}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPwd ? "text" : "password"}
                                name="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                minLength={6}
                                required
                                className={`${inputCls} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Role
                        </label>
                        <div className="flex gap-3">
                            {["USER", "ADMIN"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition ${
                                        form.role === r
                                            ? r === "ADMIN"
                                                ? "border-violet-500 bg-violet-50 text-violet-700"
                                                : "border-cyan-500 bg-cyan-50 text-cyan-700"
                                            : "border-slate-200 text-slate-400 hover:border-slate-300"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
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
                            {saving ? "Creating…" : "Create User"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// ─── Edit User Modal ──────────────────────────────────────────
const EditModal = ({ user, onSave, onClose, saving }) => {

    const [form, setForm] = useState({
        name: user.name,
        role: user.role,
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[460px] shadow-2xl">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Edit User</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Email read-only */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-1">
                            Email (read-only)
                        </label>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="w-full bg-slate-100 text-slate-400 border border-slate-200 rounded-xl p-3 cursor-not-allowed"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className={inputCls}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">
                            Role
                        </label>
                        <div className="flex gap-3">
                            {["USER", "ADMIN"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition ${
                                        form.role === r
                                            ? r === "ADMIN"
                                                ? "border-violet-500 bg-violet-50 text-violet-700"
                                                : "border-cyan-500 bg-cyan-50 text-cyan-700"
                                            : "border-slate-200 text-slate-400 hover:border-slate-300"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

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
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────
const ManageUsers = () => {

    const [users, setUsers]               = useState([]);
    const [search, setSearch]             = useState("");
    const [loading, setLoading]           = useState(true);
    const [saving, setSaving]             = useState(false);

    const [showCreate, setShowCreate]     = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [toast, setToast]               = useState(null);

    // ── Fetch ─────────────────────────────────────────────────
    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setUsers(await getAllUsers());
        } catch {
            showToast("Failed to load users", "error");
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
            const newUser = await createUser(form);
            setUsers((prev) => [...prev, newUser]);
            setShowCreate(false);
            showToast(`${newUser.name} created successfully`);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Email already in use or request failed";
            showToast(msg, "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Update ────────────────────────────────────────────────
    const handleUpdate = async (form) => {
        try {
            setSaving(true);
            const updated = await updateUser(editTarget.id, form);
            setUsers((prev) =>
                prev.map((u) => (u.id === updated.id ? updated : u))
            );
            setEditTarget(null);
            showToast("User updated successfully");
        } catch {
            showToast("Failed to update user", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Block / Unblock ───────────────────────────────────────
    const handleToggleBlock = async (user) => {
        try {
            user.blocked ? await unblockUser(user.id) : await blockUser(user.id);
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, blocked: !u.blocked } : u
                )
            );
            showToast(
                user.blocked
                    ? "User unblocked successfully"
                    : "User blocked successfully"
            );
        } catch {
            showToast("Failed to update block status", "error");
        }
    };

    // ── Delete ────────────────────────────────────────────────
    const handleDelete = async () => {
        try {
            await deleteUser(deleteTarget.id);
            setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
            setDeleteTarget(null);
            showToast("User deleted successfully");
        } catch {
            showToast("Failed to delete user", "error");
        }
    };

    // ── Filter ────────────────────────────────────────────────
    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="p-8">

            {/* ── Page Header ── */}
            <div className="flex justify-between items-start mb-6">

                <div>
                    <h1 className="text-4xl font-bold text-slate-800">
                        Users Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage all registered users
                    </p>
                </div>

                {/* ✅ Create User Button — top-right */}
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm"
                >
                    <UserPlus size={18} />
                    Create User
                </button>

            </div>

            {/* ── Search + Count ── */}
            <div className="flex items-center justify-between mb-5">
                <div className="relative w-72">
                    <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 transition bg-white text-sm"
                    />
                </div>
                <span className="text-sm text-slate-400 font-medium">
                    {users.length} total user{users.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-slate-400">
                        Loading users…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex justify-center items-center py-20 text-slate-400">
                        No users found.
                    </div>
                ) : (
                    <table className="w-full">

                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="p-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                                >
                                    <td className="p-5 font-semibold text-slate-800">
                                        {user.name}
                                    </td>
                                    <td className="p-5 text-slate-500">
                                        {user.email}
                                    </td>
                                    <td className="p-5">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="p-5">
                                        <StatusBadge blocked={user.blocked} />
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-2">

                                            {/* Edit */}
                                            <button
                                                onClick={() => setEditTarget(user)}
                                                title="Edit"
                                                className="bg-blue-100 text-blue-600 p-2.5 rounded-xl hover:bg-blue-200 transition"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* Block / Unblock */}
                                            <button
                                                onClick={() => handleToggleBlock(user)}
                                                title={user.blocked ? "Unblock" : "Block"}
                                                className={`p-2.5 rounded-xl transition ${
                                                    user.blocked
                                                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                                                        : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                                }`}
                                            >
                                                {user.blocked
                                                    ? <ShieldCheck size={16} />
                                                    : <ShieldOff size={16} />
                                                }
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => setDeleteTarget(user)}
                                                title="Delete"
                                                className="bg-red-100 text-red-600 p-2.5 rounded-xl hover:bg-red-200 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>

            {/* ── Modals ── */}
            {showCreate && (
                <CreateModal
                    onSave={handleCreate}
                    onClose={() => setShowCreate(false)}
                    saving={saving}
                />
            )}

            {editTarget && (
                <EditModal
                    user={editTarget}
                    onSave={handleUpdate}
                    onClose={() => setEditTarget(null)}
                    saving={saving}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    user={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* ── Toast ── */}
            {toast && <Toast message={toast.message} type={toast.type} />}

        </div>
    );
};

export default ManageUsers;
