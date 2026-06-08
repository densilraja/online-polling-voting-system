import { useEffect, useState } from "react";
import API from "../../api/axios";

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const RecentActivity = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [usersRes, posRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/positions"),
        ]);

        const events = [];

        // Latest registered users
        usersRes.data
          .slice(-3)
          .reverse()
          .forEach((u) => {
            if (u.createdAt) {
              events.push({
                id: `user-${u.id}`,
                title: `New voter registered: ${u.username || u.email}`,
                time: u.createdAt,
              });
            }
          });

        // Latest positions (polls started)
        posRes.data
          .slice(-3)
          .reverse()
          .forEach((p) => {
            if (p.createdAt) {
              events.push({
                id: `pos-${p.id}`,
                title: `Poll started: ${p.title}`,
                time: p.createdAt,
              });
            }
          });

        // Sort by most recent
        events.sort((a, b) => new Date(b.time) - new Date(a.time));

        setActivities(events.slice(0, 5));
      } catch (err) {
        console.error("Failed to load recent activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-slate-400">No recent activity.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3 last:border-0"
            >
              <h2 className="font-semibold text-slate-700 text-sm">{item.title}</h2>
              <p className="text-slate-400 text-xs ml-4 whitespace-nowrap">
                {timeAgo(item.time)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
