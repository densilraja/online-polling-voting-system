package com.raja.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raja.Backend.entity.Candidate;

public interface CandidateRepository
        extends JpaRepository<Candidate, Long> {

}