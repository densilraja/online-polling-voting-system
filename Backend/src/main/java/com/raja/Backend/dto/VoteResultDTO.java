package com.raja.Backend.dto;

public class VoteResultDTO {

    private String candidateName;

    private Long totalVotes;

    public VoteResultDTO() {
    }

    public VoteResultDTO(
            String candidateName,
            Long totalVotes
    ) {
        this.candidateName = candidateName;
        this.totalVotes = totalVotes;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public Long getTotalVotes() {
        return totalVotes;
    }

    public void setTotalVotes(Long totalVotes) {
        this.totalVotes = totalVotes;
    }
}