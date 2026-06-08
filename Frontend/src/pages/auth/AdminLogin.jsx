import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { loginUser }
from "../../services/authService";

import { AuthContext }
from "../../context/AuthContext";

const AdminLogin = () => {

    const navigate = useNavigate();

    const { login } =
        useContext(AuthContext);

    const [formData, setFormData] =
        useState({

            email: "",
            password: ""

        });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await loginUser(formData);

            console.log(response);

            login(response);

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "role",
                response.role
            );

            localStorage.setItem(
                "userId",
                response.id
            );

            if (response.role !== "ADMIN") {

                alert("Access Denied");

                return;
            }

            navigate("/admin/dashboard");

        } catch (error) {

            console.log(error);

            alert("Login Failed");
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-950">

            <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-2xl w-[450px]">

                <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
                    Admin Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        onChange={handleChange}
                        className="bg-slate-800 text-white p-4 rounded-xl"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="bg-slate-800 text-white p-4 rounded-xl"
                    />

                    <button
                        type="submit"
                        className="bg-cyan-500 py-4 rounded-xl text-black font-bold"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
};

export default AdminLogin;