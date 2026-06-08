import { Outlet } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      <UserNavbar />

      <main className="p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;