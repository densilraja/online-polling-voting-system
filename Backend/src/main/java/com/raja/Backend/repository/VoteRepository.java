package com.raja.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.raja.Backend.dto.VoteResultDTO;
import com.raja.Backend.entity.Vote;

public interface VoteRepository
        extends JpaRepository<Vote, Long> {

    boolean existsByUserIdAndPositionId(
            Long userId,
            Long positionId
    );

    List<Vote> findByPositionId(Long positionId);

    // ✅ NEW: needed to clean up votes before deleting a candidate
    void deleteByCandidateId(Long candidateId);

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