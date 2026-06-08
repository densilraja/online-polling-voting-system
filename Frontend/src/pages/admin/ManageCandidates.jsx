import { useState, useEffect, useRef } from "react";
import Modal from "../../components/shared/Modal";
import API from "../../api/axios";

// ── Small helper: upload a file and return the URL back from the server ──────
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/admin/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // e.g. "http://localhost:8080/uploads/abc123.jpg"
};

// ── Reusable image picker field ───────────────────────────────────────────────
const ImagePicker = ({ currentUrl, onUrlChange }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(currentUrl || "");
  }, [currentUrl]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      setUploading(true);
      const uploadedUrl = await uploadImage(file);
      onUrlChange(uploadedUrl);
    } catch {
      alert("Image upload failed. Please try again.");
      setPreview(currentUrl || "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current.click()}
        className="relative w-full h-40 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-400 transition"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <span className="text-4xl">🖼️</span>
            <span className="text-sm mt-1">Click to choose photo</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="text-sm text-cyan-600 underline text-left"
      >
        {preview ? "Change photo" : "Upload photo"}
      </button>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emptyForm = { name: "", party: "", logo: "", positionId: "" };

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addLoading, setAddLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, ...emptyForm });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/admin/candidates");
      setCandidates(res.data);
    } catch {
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await API.get("/admin/positions");
      setPositions(res.data);
    } catch (err) {
      console.error("Failed to load positions", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchPositions();
  }, []);

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.positionId) return;
    try {
      setAddLoading(true);
      await API.post("/admin/candidates", {
        name: addForm.name,
        party: addForm.party,
        logo: addForm.logo,
        positionId: Number(addForm.positionId),
      });
      setAddForm(emptyForm);
      setAddOpen(false);
      fetchCandidates();
    } catch {
      alert("Failed to add candidate. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const openEdit = (candidate) => {
    const positionObj = positions.find((p) => p.title === candidate.positionTitle);
    setEditForm({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party || "",
      logo: candidate.logo || "",
      positionId: positionObj ? positionObj.id : "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editForm.name || !editForm.positionId) return;
    try {
      setEditLoading(true);
      await API.put(`/admin/candidates/${editForm.id}`, {
        name: editForm.name,
        party: editForm.party,
        logo: editForm.logo,
        positionId: Number(editForm.positionId),
      });
      setEditOpen(false);
      fetchCandidates();
    } catch {
      alert("Failed to update candidate. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await API.delete(`/admin/candidates/${id}`);
      setDeleteId(null);
      fetchCandidates();
    } catch {
      alert("Failed to delete candidate. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-slate-800">Candidates</h1>
          <p className="text-slate-500 mt-2">Manage election candidates</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="bg-cyan-500 text-white px-6 py-4 rounded-2xl">
          + Add Candidate
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={fetchCandidates} className="mt-4 bg-cyan-500 text-white px-6 py-3 rounded-xl">Retry</button>
        </div>
      )}

      {!loading && !error && candidates.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-xl">No candidates yet.</p>
          <p className="text-slate-400 mt-2">Click "+ Add Candidate" to get started.</p>
        </div>
      )}

      {!loading && !error && candidates.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition">
              <img
                src={
                  candidate.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=300&background=06b6d4&color=fff`
                }
                alt={candidate.name}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold">{candidate.name}</h1>
                <p className="text-slate-500 mt-1">{candidate.positionTitle}</p>
                {candidate.party && <p className="text-slate-400 text-sm mt-1">{candidate.party}</p>}
                <div className="flex justify-between items-center mt-6 gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${candidate.active ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                    {candidate.active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(candidate)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">Edit</button>
                    <button onClick={() => setDeleteId(candidate.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal title="Add Candidate" isOpen={addOpen} onClose={() => { setAddOpen(false); setAddForm(emptyForm); }}>
        <div className="flex flex-col gap-4">
          <ImagePicker currentUrl={addForm.logo} onUrlChange={(url) => setAddForm({ ...addForm, logo: url })} />
          <input type="text" placeholder="Candidate Name *" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="border p-4 rounded-xl" />
          <input type="text" placeholder="Party / Affiliation" value={addForm.party} onChange={(e) => setAddForm({ ...addForm, party: e.target.value })} className="border p-4 rounded-xl" />
          <select value={addForm.positionId} onChange={(e) => setAddForm({ ...addForm, positionId: e.target.value })} className="border p-4 rounded-xl">
            <option value="">Select Position *</option>
            {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button onClick={handleAddSubmit} disabled={addLoading || !addForm.name || !addForm.positionId} className="bg-cyan-500 text-white py-4 rounded-xl disabled:opacity-50">
            {addLoading ? "Adding..." : "Add Candidate"}
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Candidate" isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-4">
          <ImagePicker currentUrl={editForm.logo} onUrlChange={(url) => setEditForm({ ...editForm, logo: url })} />
          <input type="text" placeholder="Candidate Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border p-4 rounded-xl" />
          <input type="text" placeholder="Party / Affiliation" value={editForm.party} onChange={(e) => setEditForm({ ...editForm, party: e.target.value })} className="border p-4 rounded-xl" />
          <select value={editForm.positionId} onChange={(e) => setEditForm({ ...editForm, positionId: e.target.value })} className="border p-4 rounded-xl">
            <option value="">Select Position *</option>
            {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button onClick={handleEditSubmit} disabled={editLoading || !editForm.name || !editForm.positionId} className="bg-cyan-500 text-white py-4 rounded-xl disabled:opacity-50">
            {editLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal title="Delete Candidate" isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="flex flex-col gap-6">
          <p className="text-slate-600">Are you sure you want to delete this candidate? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} disabled={deleteLoading} className="flex-1 bg-red-500 text-white py-3 rounded-xl disabled:opacity-50">
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCandidates;
