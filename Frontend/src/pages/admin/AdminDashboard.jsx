import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import VoteChart from "../../components/admin/VoteChart";
import RecentActivity from "../../components/admin/RecentActivity";
import API from "../../api/axios";

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    totalVoters: 0,
    candidates: 0,
    votesCasted: 0,
    activePolls: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [votersRes, candidatesRes, votesRes, positionsRes] =
          await Promise.all([
            API.get("/results/total-voters"),
            API.get("/admin/candidates"),
            API.get("/results/total-votes"),
            API.get("/admin/positions"),
          ]);

        const activePolls = positionsRes.data.filter(
          (p) => p.active && (!p.endTime || new Date(p.endTime) > new Date())
        ).length;

        setStats({
          totalVoters: votersRes.data,
          candidates: candidatesRes.data.length,
          votesCasted: votesRes.data,
          activePolls,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome back Administrator</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Voters"
          value={stats.totalVoters.toLocaleString()}
          color="text-cyan-500"
        />
        <StatCard
          title="Candidates"
          value={stats.candidates.toLocaleString()}
          color="text-violet-500"
        />
        <StatCard
          title="Votes Casted"
          value={stats.votesCasted.toLocaleString()}
          color="text-green-500"
        />
        <StatCard
          title="Active Polls"
          value={stats.activePolls.toLocaleString()}
          color="text-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="col-span-2">
          <VoteChart />
        </div>
        <RecentActivity />
      </div>

    </div>
  );
};

export default AdminDashboard;
