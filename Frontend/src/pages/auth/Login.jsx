import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            // ✅ FIX: Wipe any stale session data before attempting login.
            // An old expired token in localStorage was being sent with the
            // login request, which caused the backend to reject it.
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");

            const response = await loginUser(formData);

            console.log("Login Response:", response);

            login(response);

            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);
            localStorage.setItem("userId", response.id);
            localStorage.setItem("username", response.username);

            if (response.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data ||
                "Invalid Email or Password"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-950">

            <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-2xl w-[450px]">

                <h1 className="text-4xl font-bold text-center mb-2 text-cyan-400">
                    VoteX
                </h1>

                <p className="text-slate-400 text-center mb-8">
                    Online Polling & Voting System
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl outline-none focus:border-cyan-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl outline-none focus:border-cyan-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-500 hover:bg-cyan-600 transition py-4 rounded-xl text-black font-bold"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <div className="mt-6 text-center">

                    <p className="text-slate-400">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="text-cyan-400 hover:text-cyan-300"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;
