import { Link, useNavigate } from "react-router-dom";

const UserNavbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Remove authentication/session data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-violet-700">
        Online Voting
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-6">

        <Link
          to="/user/dashboard"
          className="hover:text-violet-600 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/user/vote"
          className="hover:text-violet-600 transition"
        >
          Vote
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default UserNavbar;