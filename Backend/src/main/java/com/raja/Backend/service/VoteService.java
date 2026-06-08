package com.raja.Backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raja.Backend.dto.VoteResultDTO;
import com.raja.Backend.entity.Candidate;
import com.raja.Backend.entity.Position;
import com.raja.Backend.entity.User;
import com.raja.Backend.entity.Vote;
import com.raja.Backend.repository.CandidateRepository;
import com.raja.Backend.repository.PositionRepository;
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.repository.VoteRepository;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private PositionRepository positionRepository;

    public String castVote(
            Long userId,
            Long candidateId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Candidate candidate =
                candidateRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found"));

        Position position = candidate.getPosition();

        if (!position.isActive()) {

            throw new RuntimeException(
                    "Election is not active");
        }

        if (voteRepository.existsByUserIdAndPositionId(
                userId,
                position.getId()
        )) {

            throw new RuntimeException(
                    "You already voted for this position");
        }

        Vote vote = new Vote();

        vote.setUser(user);

        vote.setCandidate(candidate);

        vote.setPosition(position);

        vote.setVotedAt(LocalDateTime.now());

        voteRepository.save(vote);

        return "Vote Cast Successfully";
    }

    public List<Vote> getVotesByPosition(
            Long positionId
    ) {

        return voteRepository.findByPositionId(
                positionId
        );
    }

    public List<VoteResultDTO> getResultsByPosition(
            Long positionId
    ) {

        return voteRepository
                .getResultsByPosition(positionId);
    }

    public VoteResultDTO getWinner(
            Long positionId
    ) {

        List<VoteResultDTO> results =
                voteRepository
                        .getResultsByPosition(positionId);

        if(results.isEmpty()) {

            return null;
        }

        return results.get(0);
    }

    public Long getTotalVotes() {

        return voteRepository.count();
    }

    public Long getTotalVoters() {

        return voteRepository.findAll()
                .stream()
                .map(vote -> vote.getUser().getId())
                .distinct()
                .count();
    }
}