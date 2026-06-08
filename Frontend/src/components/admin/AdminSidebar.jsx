import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BadgeCheck,
  Settings,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <>

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}

      <div
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-slate-950 text-white p-6 z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >

        {/* Close Button */}

        <div className="flex justify-end lg:hidden mb-6">

          <button onClick={() => setSidebarOpen(false)}>
            <X size={28} />
          </button>

        </div>

        {/* Logo */}

        <div className="mb-12">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            VoteX Admin
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Online Polling System
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-3">

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <LayoutDashboard size={22} />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <Users size={22} />
            Users
          </Link>

          <Link
            to="/admin/candidates"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <UserSquare2 size={22} />
            Candidates
          </Link>

          <Link
            to="/admin/positions"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <BadgeCheck size={22} />
            Positions
          </Link>

          <Link
            to="/admin/poll-settings"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <Settings size={22} />
            Poll Settings
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800 transition"
          >
            <BarChart3 size={22} />
            Analytics
          </Link>

          <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/20 text-red-400 mt-10 transition">
            <LogOut size={22} />
            Logout
          </button>

        </nav>

      </div>

    </>
  );
};

export default AdminSidebar;