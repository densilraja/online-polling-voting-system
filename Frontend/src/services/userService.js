import API from "../api/axios";

// GET ALL USERS
export const getAllUsers = async () => {
    const response = await API.get("/admin/users");
    return response.data;
};

// CREATE USER (admin-only, can set any role)
export const createUser = async (data) => {
    const response = await API.post("/admin/users", data);
    return response.data;
};

// UPDATE USER (name / role)
export const updateUser = async (id, data) => {
    const response = await API.put(`/admin/users/${id}`, data);
    return response.data;
};

// BLOCK USER
export const blockUser = async (id) => {
    const response = await API.put(`/admin/users/block/${id}`);
    return response.data;
};

// UNBLOCK USER
export const unblockUser = async (id) => {
    const response = await API.put(`/admin/users/unblock/${id}`);
    return response.data;
};

// DELETE USER
export const deleteUser = async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
};