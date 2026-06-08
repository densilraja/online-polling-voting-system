import { useEffect, useState } from "react";
import API from "../../api/axios";

const VotePage = () => {
  const userId = localStorage.getItem("userId");

  // All active positions with their candidates
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track which positions the user already voted in: Set of positionIds
  const [votedPositions, setVotedPositions] = useState(new Set());

  // Voting in-progress per candidate
  const [votingId, setVotingId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch active positions and all candidates in parallel
      const [posRes, candRes] = await Promise.all([
        API.get("/user/positions"),
        API.get("/user/candidates"),
      ]);

      const now = new Date();

      // Only keep active, not-yet-ended positions
      const activePositions = posRes.data.filter(
        (p) => p.active && (!p.endTime || new Date(p.endTime) > now),
      );

      // Group candidates by positionTitle
      const candByPosition = {};
      candRes.data.forEach((c) => {
        if (!candByPosition[c.positionTitle])
          candByPosition[c.positionTitle] = [];
        candByPosition[c.positionTitle].push(c);
      });

      // Attach candidates to their position
      const enriched = activePositions.map((p) => ({
        ...p,
        candidates: candByPosition[p.title] || [],
      }));

      setPositions(enriched);

      // Check which positions this user already voted in
      // by attempting a vote — instead, we track locally via localStorage
      const saved = JSON.parse(localStorage.getItem(`voted_${userId}`) || "[]");
      setVotedPositions(new Set(saved));
    } catch (err) {
      showToast("Failed to load voting data. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId, positionId) => {
    if (!userId) {
      showToast("User session expired. Please log in again.", "error");
      return;
    }

    try {
      setVotingId(candidateId);
      await API.post(`/user/votes/${userId}/${candidateId}`);

      // Mark this position as voted locally
      const updated = new Set(votedPositions);
      updated.add(positionId);
      setVotedPositions(updated);
      localStorage.setItem(`voted_${userId}`, JSON.stringify([...updated]));

      showToast("✅ Your vote has been cast successfully!");
    } catch (err) {
      const msg = err?.response?.data || "";
      if (msg.includes("already voted")) {
        showToast("You have already voted for this position.", "error");
        // Sync local state
        const updated = new Set(votedPositions);
        updated.add(positionId);
        setVotedPositions(updated);
        localStorage.setItem(`voted_${userId}`, JSON.stringify([...updated]));
      } else if (msg.includes("not active")) {
        showToast("This election is no longer active.", "error");
      } else {
        showToast("Failed to cast vote. Please try again.", "error");
      }
    } finally {
      setVotingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-slate-800">Active Voting</h1>
        <p className="text-slate-500 mt-2">
          Cast your vote securely — one vote per position
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <p className="text-2xl mb-2">No active elections right now.</p>
          <p>Check the Dashboard to see when polls open.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {positions.map((position) => {
            const alreadyVoted = votedPositions.has(position.id);

            return (
              <div key={position.id}>
                {/* Position heading */}
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">
                    {position.title}
                  </h2>
                  {alreadyVoted ? (
                    <span className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full">
                      ✓ Voted
                    </span>
                  ) : (
                    <span className="bg-violet-100 text-violet-600 text-sm font-semibold px-3 py-1 rounded-full">
                      Open
                    </span>
                  )}
                  {position.endTime && (
                    <span className="text-slate-400 text-sm ml-auto">
                      Closes:{" "}
                      {new Date(position.endTime).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                {position.candidates.length === 0 ? (
                  <p className="text-slate-400 italic">
                    No candidates registered for this position yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-8">
                    {position.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`bg-white rounded-3xl overflow-hidden shadow-xl transition ${
                          alreadyVoted ? "opacity-70" : "hover:scale-105"
                        }`}
                      >
                        <img
                          src={
                            candidate.logo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=300&background=7c3aed&color=fff`
                          }
                          alt={candidate.name}
                          className="h-60 w-full object-cover"
                        />

                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-slate-800">
                            {candidate.name}
                          </h3>
                          {candidate.party && (
                            <p className="text-slate-400 text-sm mt-1">
                              {candidate.party}
                            </p>
                          )}

                          {alreadyVoted ? (
                            <div className="w-full mt-6 bg-green-50 text-green-600 py-4 rounded-2xl font-semibold text-center border border-green-200">
                              ✓ Vote Cast
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                castVote(candidate.id, position.id)
                              }
                              disabled={votingId === candidate.id}
                              className="w-full mt-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-4 rounded-2xl font-semibold transition"
                            >
                              {votingId === candidate.id
                                ? "Casting..."
                                : "Vote Now"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default VotePage;
