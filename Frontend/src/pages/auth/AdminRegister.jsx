const AdminRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl w-[450px]">

        <h1 className="text-4xl text-cyan-400 font-bold text-center mb-8">
          Admin Register
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Admin Name"
            className="bg-slate-800 text-white p-4 rounded-xl"
          />

          <input
            type="email"
            placeholder="Admin Email"
            className="bg-slate-800 text-white p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-slate-800 text-white p-4 rounded-xl"
          />

          <button className="bg-cyan-500 py-4 rounded-xl text-black font-bold">
            Register
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminRegister;