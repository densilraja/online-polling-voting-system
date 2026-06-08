import { Link } from "react-router-dom";

const UserNavbar = () => {
  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between">

      <h1 className="text-2xl font-bold text-violet-700">
        Online Voting
      </h1>

      <div className="flex gap-6">

        <Link to="/user/dashboard">
          Dashboard
        </Link>

        <Link to="/user/vote">
          Vote
        </Link>

      </div>
    </div>
  );
};

export default UserNavbar;