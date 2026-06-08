import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "USER") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default UserProtectedRoute;