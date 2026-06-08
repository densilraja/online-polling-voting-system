import {
  Trash2,
  Ban,
  Pencil,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "Densil Raja",
    email: "densil@gmail.com",
    role: "USER",
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@gmail.com",
    role: "USER",
    status: "Blocked",
  },
];

const UserTable = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

      <div className="p-6 border-b">

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Users Management
          </h1>

          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold transition">
            + Add User
          </button>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-5">
                Name
              </th>

              <th className="text-left p-5">
                Email
              </th>

              <th className="text-left p-5">
                Role
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="p-5 font-semibold">
                  {user.name}
                </td>

                <td className="p-5 text-slate-600">
                  {user.email}
                </td>

                <td className="p-5">
                  <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {user.role}
                  </span>
                </td>

                <td className="p-5">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>

                </td>

                <td className="p-5">

                  <div className="flex gap-3">

                    <button className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:scale-105 transition">
                      <Pencil size={18} />
                    </button>

                    <button className="bg-yellow-100 text-yellow-700 p-3 rounded-xl hover:scale-105 transition">
                      <Ban size={18} />
                    </button>

                    <button className="bg-red-100 text-red-600 p-3 rounded-xl hover:scale-105 transition">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default UserTable;