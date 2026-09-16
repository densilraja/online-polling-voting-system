package com.raja.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.raja.Backend.dto.VoteResultDTO;
import com.raja.Backend.entity.Vote;

// Repository interface for performing database operations on Vote entity
// JpaRepository provides built-in CRUD methods such as save(), findById(), deleteById(), etc.
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Checks whether a vote already exists for a particular user and position.
    // Used to ensure that a user can vote only once for each position.
    //
    // true  -> user has already voted for this position
    // false -> user has not voted for this position
    boolean existsByUserIdAndPositionId(
            Long userId,
            Long positionId
    );


    // Retrieves all votes belonging to a particular position.
    // Spring Data JPA creates the query automatically from the method name.
    List<Vote> findByPositionId(Long positionId);


    // Deletes all votes associated with a particular candidate.
    // Useful when deleting a candidate who already has vote records.
    void deleteByCandidateId(Long candidateId);


    // Custom JPQL query to calculate voting results for a position.
    @Query("""
            SELECT new com.raja.Backend.dto.VoteResultDTO(
                v.candidate.name,
                COUNT(v)
            )
            FROM Vote v

            WHERE v.position.id = :positionId

            GROUP BY v.candidate.name

            ORDER BY COUNT(v) DESC
            """)
    List<VoteResultDTO> getResultsByPosition(
            Long positionId
    );
}