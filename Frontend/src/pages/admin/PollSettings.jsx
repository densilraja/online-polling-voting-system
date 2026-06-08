import { useState, useEffect } from "react";
import API from "../../api/axios";

// ── Countdown timer for a single position ─────────────────────────────────────
const Countdown = ({ endTime }) => {
  const calc = () => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (!time) return <span className="text-red-400 font-semibold text-sm">Ended</span>;

  return (
    <div className="flex gap-2 mt-1">
      {[["d", time.d], ["h", time.h], ["m", time.m], ["s", time.s]].map(([label, val]) => (
        <div key={label} className="flex flex-col items-center bg-slate-100 rounded-lg px-2 py-1 min-w-[36px]">
          <span className="text-sm font-bold text-slate-800">{String(val).padStart(2, "0")}</span>
          <span className="text-[10px] text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const PollSettings = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/positions");
      setPositions(res.data);
    } catch {
      // silently fail; retry button handles it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPositions(); }, []);

  const toggleActive = async (position) => {
    try {
      setTogglingId(position.id);
      await API.put(`/admin/positions/${position.id}`, {
        title: position.title,
        description: position.description,
        maxVotesAllowed: position.maxVotesAllowed,
        endTime: position.endTime,
        active: !position.active,
      });
      fetchPositions();
    } catch {
      alert("Failed to update position. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = positions.filter((p) => p.active).length;
  const endedCount = positions.filter(
    (p) => p.endTime && new Date(p.endTime) < new Date()
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-slate-800">Poll Settings</h1>
        <p className="text-slate-500 mt-2">Live status and quick controls for all positions</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Total Positions</p>
          <p className="text-4xl font-bold text-slate-800 mt-1">{positions.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Currently Active</p>
          <p className="text-4xl font-bold text-green-500 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Polls Ended</p>
          <p className="text-4xl font-bold text-red-400 mt-1">{endedCount}</p>
        </div>
      </div>

      {/* Position list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No positions found. Add positions first from the Positions page.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {positions.map((pos) => {
            const isEnded = pos.endTime && new Date(pos.endTime) < new Date();
            const toggling = togglingId === pos.id;

            return (
              <div
                key={pos.id}
                className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between gap-6"
              >
                {/* Left: info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">{pos.title}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        pos.active
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {pos.active ? "Active" : "Inactive"}
                    </span>
                    {isEnded && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-500 font-medium">
                        Ended
                      </span>
                    )}
                  </div>

                  {pos.description && (
                    <p className="text-slate-400 text-sm mt-1">{pos.description}</p>
                  )}

                  <div className="flex flex-wrap gap-6 mt-3">
                    {/* Max votes */}
                    <div>
                      <p className="text-xs text-slate-400">Max Votes</p>
                      <p className="font-semibold text-cyan-500">{pos.maxVotesAllowed ?? "—"}</p>
                    </div>

                    {/* End time + countdown */}
                    {pos.endTime && (
                      <div>
                        <p className="text-xs text-slate-400">
                          Ends {new Date(pos.endTime).toLocaleString()}
                        </p>
                        {!isEnded && <Countdown endTime={pos.endTime} />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: toggle */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-400">{pos.active ? "Deactivate" : "Activate"}</p>
                  <button
                    onClick={() => toggleActive(pos)}
                    disabled={toggling}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 ${
                      pos.active ? "bg-cyan-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        pos.active ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hint */}
      <p className="text-slate-400 text-sm mt-8 text-center">
        To change end times or max votes, go to the{" "}
        <a href="/admin/positions" className="text-cyan-500 underline">
          Positions
        </a>{" "}
        page.
      </p>
    </div>
  );
};

export default PollSettings;
