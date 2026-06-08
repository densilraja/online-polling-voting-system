import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const UserDashboard = () => {
  const username = localStorage.getItem("username") || "User";

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await API.get("/user/positions");
        setPositions(res.data);
      } catch (err) {
        console.error("Failed to fetch positions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const activePositions = positions.filter((p) => {
    if (!p.active) return false;
    if (p.endTime && new Date(p.endTime) < new Date()) return false;
    return true;
  });

  const endedPositions = positions.filter(
    (p) => p.endTime && new Date(p.endTime) < new Date()
  );

  return (
    <div className="p-8">

      {/* Welcome */}
      <h1 className="text-4xl font-bold mb-2">Welcome, {username} 👋</h1>
      <p className="text-slate-500 mb-10">Here's an overview of the current elections.</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Total Elections</p>
          <p className="text-4xl font-bold text-slate-800 mt-1">{positions.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Active Now</p>
          <p className="text-4xl font-bold text-green-500 mt-1">{activePositions.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-slate-400 text-sm">Ended</p>
          <p className="text-4xl font-bold text-red-400 mt-1">{endedPositions.length}</p>
        </div>
      </div>

      {/* Active Elections */}
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold mb-6">Active Elections</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activePositions.length === 0 ? (
          <p className="text-slate-400">No active elections at the moment. Check back later.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {activePositions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl hover:border-violet-400 transition"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{pos.title}</h3>
                  {pos.description && (
                    <p className="text-slate-400 text-sm mt-0.5">{pos.description}</p>
                  )}
                  {pos.endTime && (
                    <p className="text-xs text-slate-400 mt-1">
                      Closes: {new Date(pos.endTime).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <Link
                  to="/user/vote"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold transition text-sm"
                >
                  Vote Now →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ended Elections */}
      {endedPositions.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-500">Ended Elections</h2>
          <div className="flex flex-col gap-4">
            {endedPositions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl opacity-70"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-600">{pos.title}</h3>
                  {pos.description && (
                    <p className="text-slate-400 text-sm mt-0.5">{pos.description}</p>
                  )}
                  {pos.endTime && (
                    <p className="text-xs text-red-400 mt-1">
                      Ended: {new Date(pos.endTime).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <span className="text-xs bg-red-100 text-red-500 px-4 py-2 rounded-xl font-semibold">
                  Closed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
