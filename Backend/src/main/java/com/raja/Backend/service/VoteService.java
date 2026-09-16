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
import com.raja.Backend.exception.AlreadyVotedException;
import com.raja.Backend.exception.CandidateNotFoundException;
import com.raja.Backend.exception.ElectionNotActiveException;
import com.raja.Backend.exception.UserNotFoundException;
import com.raja.Backend.repository.CandidateRepository;
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.repository.VoteRepository;

@Service
public class VoteService {

    // Repository used to save and retrieve Vote records
    @Autowired
    private VoteRepository voteRepository;

    // Repository used to find the voter/user
    @Autowired
    private UserRepository userRepository;

    // Repository used to find the selected candidate
    @Autowired
    private CandidateRepository candidateRepository;


    // -------------------- CAST VOTE --------------------

    public String castVote(
            Long userId,
            Long candidateId
    ) {

        // Find the user who is trying to vote
        // If the user does not exist, throw a custom exception
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        )
                );


        // Find the candidate selected by the user
        // If the candidate does not exist, throw a custom exception
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() ->
                        new CandidateNotFoundException(
                                "Candidate not found"
                        )
                );


        // Get the position associated with the candidate
        Position position = candidate.getPosition();


        // Check whether the election/position is currently active
        if (!position.isActive()) {

            throw new ElectionNotActiveException(
                    "Election is not active"
            );
        }


        // Check whether this user has already voted
        // for this particular position
        if (voteRepository.existsByUserIdAndPositionId(
                userId,
                position.getId()
        )) {

            // Prevent the user from voting twice
            // for the same position
            throw new AlreadyVotedException(
                    "You already voted for this position"
            );
        }


        // Create a new Vote entity
        Vote vote = new Vote();

        // Associate the vote with the user
        vote.setUser(user);

        // Associate the vote with the selected candidate
        vote.setCandidate(candidate);

        // Associate the vote with the candidate's position
        vote.setPosition(position);

        // Store the time at which the vote was cast
        vote.setVotedAt(LocalDateTime.now());

        // Save the vote into the database
        voteRepository.save(vote);

        return "Vote Cast Successfully";
    }


    // -------------------- GET VOTES BY POSITION --------------------

    public List<Vote> getVotesByPosition(
            Long positionId
    ) {

        // Retrieve all votes belonging to a particular position
        return voteRepository.findByPositionId(
                positionId
        );
    }


    // -------------------- GET RESULTS --------------------

    public List<VoteResultDTO> getResultsByPosition(
            Long positionId
    ) {

        // Get the aggregated voting results
        // from the custom JPQL query in VoteRepository
        return voteRepository.getResultsByPosition(
                positionId
        );
    }


    // -------------------- GET WINNER --------------------

    public VoteResultDTO getWinner(
            Long positionId
    ) {

        // Retrieve the results ordered by vote count
        // in descending order
        List<VoteResultDTO> results =
                voteRepository.getResultsByPosition(
                        positionId
                );


        // If there are no votes, there is no winner
        if (results.isEmpty()) {
            return null;
        }


        // The first result has the highest vote count
        // because the repository query uses ORDER BY COUNT(v) DESC
        return results.get(0);
    }


    // -------------------- GET TOTAL VOTES --------------------

    public Long getTotalVotes() {

        // JpaRepository's count() returns the total
        // number of Vote records in the database
        return voteRepository.count();
    }


    // -------------------- GET TOTAL VOTERS --------------------

    public Long getTotalVoters() {

        // Get all vote records
        return voteRepository.findAll()

                // Extract the user ID from each vote
                .stream()
                .map(vote -> vote.getUser().getId())

                // Remove duplicate user IDs
                // because one user can vote for multiple positions
                .distinct()

                // Count the unique users
                .count();
    }
}