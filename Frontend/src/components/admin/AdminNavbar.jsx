import { Menu } from "lucide-react";

const AdminNavbar = ({ setSidebarOpen }) => {
  return (
    <div className="bg-white shadow-md h-20 flex items-center justify-between px-6">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu size={28} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm select-none">
          A
        </div>
        <span className="hidden md:block font-semibold text-slate-700">
          Administrator
        </span>
      </div>

    </div>
  );
};

export default AdminNavbar;
