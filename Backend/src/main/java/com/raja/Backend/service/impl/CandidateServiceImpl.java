package com.raja.Backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raja.Backend.dto.CandidateRequest;
import com.raja.Backend.dto.CandidateResponse;
import com.raja.Backend.entity.Candidate;
import com.raja.Backend.entity.Position;
import com.raja.Backend.repository.CandidateRepository;
import com.raja.Backend.repository.PositionRepository;
import com.raja.Backend.repository.VoteRepository;
import com.raja.Backend.service.CandidateService;

@Service
public class CandidateServiceImpl
        implements CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private PositionRepository positionRepository;

    // ✅ NEW: injected so we can delete votes before deleting a candidate
    @Autowired
    private VoteRepository voteRepository;

    @Override
    public String addCandidate(
            CandidateRequest request
    ) {

        Position position =
                positionRepository.findById(
                        request.getPositionId()
                ).orElseThrow();

        Candidate candidate = new Candidate();

        candidate.setName(request.getName());

        candidate.setParty(request.getParty());

        candidate.setLogo(request.getLogo());

        candidate.setPosition(position);

        candidateRepository.save(candidate);

        return "Candidate Added Successfully";
    }

    @Override
    public List<CandidateResponse> getAllCandidates() {

        return candidateRepository.findAll()
                .stream()
                .map(candidate ->
                        new CandidateResponse(
                                candidate.getId(),
                                candidate.getName(),
                                candidate.getParty(),
                                candidate.getLogo(),
                                candidate.isActive(),
                                candidate.getPosition()
                                        .getTitle()
                        )
                )
                .toList();
    }

    @Override
    @Transactional  // ✅ both deletes happen in one transaction
    public String deleteCandidate(Long id) {

        // ✅ FIX: delete all votes for this candidate first,
        // otherwise MySQL raises a foreign key constraint violation.
        voteRepository.deleteByCandidateId(id);

        candidateRepository.deleteById(id);

        return "Candidate Deleted Successfully";
    }
}