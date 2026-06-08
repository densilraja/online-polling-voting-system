import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminRegister from "./pages/auth/AdminRegister";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import VotePage from "./pages/user/VotePage";

import ManageUsers from "./pages/admin/ManageUsers";
import ManageCandidates from "./pages/admin/ManageCandidates";
import ManagePositions from "./pages/admin/ManagePositions";
import PollSettings from "./pages/admin/PollSettings";
import Analytics from "./pages/admin/Analytics";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import UserProtectedRoute from "./routes/UserProtectedRoute";

function App() {

    return (

        <Routes>

            {/* DEFAULT ROUTE */}
            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            {/* AUTH ROUTES */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route
                path="/admin/register"
                element={<AdminRegister />}
            />

            {/* USER ROUTES */}
            <Route
                path="/user"
                element={

                    <UserProtectedRoute>

                        <UserLayout />

                    </UserProtectedRoute>
                }
            >

                <Route
                    path="dashboard"
                    element={<UserDashboard />}
                />

                <Route
                    path="vote"
                    element={<VotePage />}
                />

            </Route>

            {/* ADMIN ROUTES */}
            <Route
                path="/admin"
                element={

                    <AdminProtectedRoute>

                        <AdminLayout />

                    </AdminProtectedRoute>
                }
            >

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="users"
                    element={<ManageUsers />}
                />

                <Route
                    path="candidates"
                    element={<ManageCandidates />}
                />

                <Route
                    path="positions"
                    element={<ManagePositions />}
                />

                <Route
                    path="poll-settings"
                    element={<PollSettings />}
                />

                <Route
                    path="analytics"
                    element={<Analytics />}
                />

            </Route>

        </Routes>
    );
}

export default App;