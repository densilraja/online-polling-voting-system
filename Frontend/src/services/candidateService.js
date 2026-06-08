import API from "../api/axios";

// GET ALL CANDIDATES
export const getAllCandidates = async () => {

    const response =
        await API.get("/admin/candidates");

    return response.data;
};

// GET CANDIDATE BY ID
export const getCandidateById = async (id) => {

    const response =
        await API.get(`/admin/candidates/${id}`);

    return response.data;
};

// CREATE CANDIDATE
export const createCandidate = async (candidateData) => {

    const response =
        await API.post(
            "/admin/candidates",
            candidateData
        );

    return response.data;
};

// UPDATE CANDIDATE
export const updateCandidate = async (
    id,
    candidateData
) => {

    const response =
        await API.put(
            `/admin/candidates/${id}`,
            candidateData
        );

    return response.data;
};

// DELETE CANDIDATE
export const deleteCandidate = async (id) => {

    const response =
        await API.delete(
            `/admin/candidates/${id}`
        );

    return response.data;
};