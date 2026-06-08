import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080"
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    // ✅ FIX: Don't attach an old/expired token to login or register requests.
    // The old code blindly sent whatever token was in localStorage — even a
    // stale expired one — which caused the JWT filter to block /auth/login.
    const isAuthEndpoint =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register");

    if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;
