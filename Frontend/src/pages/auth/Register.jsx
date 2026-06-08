const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[450px]">

        <h1 className="text-4xl font-bold mb-8 text-center text-violet-700">
          User Register
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-4 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-4 rounded-xl"
          />

          <button className="bg-violet-700 text-white py-4 rounded-xl">
            Register
          </button>

        </div>

      </div>
    </div>
  );
};

export default Register;