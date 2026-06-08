import API from "../api/axios";

// CAST VOTE
export const castVote = async (
    userId,
    candidateId
) => {

    const response =
        await API.post(
            `/user/votes/${userId}/${candidateId}`
        );

    return response.data;
};

// GET VOTES BY POSITION
export const getVotesByPosition = async (
    positionId
) => {

    const response =
        await API.get(
            `/user/votes/position/${positionId}`
        );

    return response.data;
};

// GET RESULTS
export const getResultsByPosition = async (
    positionId
) => {

    const response =
        await API.get(
            `/results/position/${positionId}`
        );

    return response.data;
};