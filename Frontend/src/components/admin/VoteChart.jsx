import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../../api/axios";

const VoteChart = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const posRes = await API.get("/admin/positions");

        // Fetch results for every position in parallel
        const results = await Promise.all(
          posRes.data.map(async (pos) => {
            const resRes = await API.get(`/results/position/${pos.id}`);
            const totalVotes = resRes.data.reduce(
              (sum, r) => sum + Number(r.totalVotes),
              0
            );
            return { name: pos.title, votes: totalVotes };
          })
        );

        setData(results.filter((r) => r.votes > 0));
      } catch (err) {
        console.error("Failed to load vote chart data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Voting Analytics</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-slate-400 text-center py-16">No votes cast yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" fill="#06b6d4" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default VoteChart;
