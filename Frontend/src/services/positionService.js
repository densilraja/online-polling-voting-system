import API from "../api/axios";

// GET ALL POSITIONS
export const getAllPositions = async () => {

    const response =
        await API.get("/admin/positions");

    return response.data;
};

// GET POSITION BY ID
export const getPositionById = async (id) => {

    const response =
        await API.get(`/admin/positions/${id}`);

    return response.data;
};

// CREATE POSITION
export const createPosition = async (
    positionData
) => {

    const response =
        await API.post(
            "/admin/positions",
            positionData
        );

    return response.data;
};

// UPDATE POSITION
export const updatePosition = async (
    id,
    positionData
) => {

    const response =
        await API.put(
            `/admin/positions/${id}`,
            positionData
        );

    return response.data;
};

// DELETE POSITION
export const deletePosition = async (id) => {

    const response =
        await API.delete(
            `/admin/positions/${id}`
        );

    return response.data;
};