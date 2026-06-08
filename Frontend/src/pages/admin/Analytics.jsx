import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../../api/axios";

const COLORS = [
  "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b",
  "#ef4444", "#3b82f6", "#ec4899", "#14b8a6",
];

const Analytics = () => {

  const [endedPositions, setEndedPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const posRes = await API.get("/admin/positions");
        const now = new Date();

        // Only positions that have ended
        const ended = posRes.data.filter(
          (p) => p.endTime && new Date(p.endTime) < now
        );

        // Fetch results for each ended position
        const enriched = await Promise.all(
          ended.map(async (pos) => {
            try {
              const resRes = await API.get(`/results/position/${pos.id}`);
              const chartData = resRes.data.map((r) => ({
                name: r.candidateName,
                value: Number(r.totalVotes),
              }));
              const totalVotes = chartData.reduce((s, r) => s + r.value, 0);
              return { ...pos, chartData, totalVotes };
            } catch {
              return { ...pos, chartData: [], totalVotes: 0 };
            }
          })
        );

        setEndedPositions(enriched);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <h1 className="text-5xl font-bold text-slate-800 mb-2">Analytics</h1>
      <p className="text-slate-500 mb-10">Vote distribution for completed elections</p>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : endedPositions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center text-slate-400">
          <p className="text-2xl mb-2">No ended elections yet.</p>
          <p>Analytics will appear here once a poll closes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {endedPositions.map((pos) => (
            <div key={pos.id} className="bg-white rounded-3xl p-8 shadow-lg">

              {/* Position header */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-800">{pos.title}</h2>
                <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full font-semibold">
                  Ended
                </span>
              </div>
              {pos.endTime && (
                <p className="text-sm text-slate-400 mb-6">
                  Closed on{" "}
                  {new Date(pos.endTime).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                  {" · "}
                  <span className="font-semibold text-slate-600">
                    {pos.totalVotes} total vote{pos.totalVotes !== 1 ? "s" : ""}
                  </span>
                </p>
              )}

              {pos.chartData.length === 0 ? (
                <p className="text-slate-400 italic">No votes were cast for this position.</p>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">

                  {/* Pie Chart */}
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={pos.chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {pos.chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} votes`, "Votes"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Leaderboard */}
                  <div className="flex flex-col gap-3">
                    {[...pos.chartData]
                      .sort((a, b) => b.value - a.value)
                      .map((entry, index) => {
                        const pct = pos.totalVotes > 0
                          ? ((entry.value / pos.totalVotes) * 100).toFixed(1)
                          : 0;
                        return (
                          <div key={entry.name}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {index === 0 && (
                                  <span className="text-yellow-500 font-bold">🏆</span>
                                )}
                                <span className="font-semibold text-slate-700">{entry.name}</span>
                              </div>
                              <span className="text-slate-500 text-sm">
                                {entry.value} votes ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: COLORS[
                                    pos.chartData.findIndex((d) => d.name === entry.name) %
                                    COLORS.length
                                  ],
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
