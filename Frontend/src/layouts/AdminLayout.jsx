import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import { useState } from "react";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar — sticky, full height, never scrolls */}
      <div className="flex-shrink-0">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Right side — navbar + scrollable content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
