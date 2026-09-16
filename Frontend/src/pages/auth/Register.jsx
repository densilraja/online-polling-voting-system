import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      setLoading(true);

      const data = {
        name: name.trim(),
        email: email.trim(),
        password: password
      };

      console.log("Register request:", data);

      await registerUser(data);

      setSuccess("Registration successful! Redirecting to login...");

      // Navigate to login after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      console.error("Registration failed:", error);

      if (error.response) {

        // Backend returned an error
        setError(
          error.response.data?.message ||
          "Registration failed"
        );

      } else if (error.request) {

        // Request was sent but backend didn't respond
        setError(
          "Unable to connect to the server. Please try again."
        );

      } else {

        // Something went wrong before request
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[450px]">

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8 text-center text-violet-700">
          User Register
        </h1>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-700 text-white py-4 rounded-xl hover:bg-violet-800 disabled:bg-violet-400 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login Navigation */}
        <div className="mt-6 text-center">
          <p className="text-slate-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="text-violet-600 font-semibold hover:text-violet-800 transition"
            >
              Login
            </Link>

          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;