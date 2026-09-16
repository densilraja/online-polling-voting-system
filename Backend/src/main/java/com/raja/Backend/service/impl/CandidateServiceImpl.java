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

    // Used to perform database operations on Candidate
    @Autowired
    private CandidateRepository candidateRepository;

    // Used to find the Position selected for the candidate
    @Autowired
    private PositionRepository positionRepository;

    // Used to delete votes associated with a candidate
    // before deleting the candidate itself
    @Autowired
    private VoteRepository voteRepository;


    // -------------------- ADD CANDIDATE --------------------

    @Override
    public String addCandidate(CandidateRequest request) {

        // Find the position using the position ID received
        // from the frontend request
        Position position = positionRepository.findById(
                request.getPositionId()
        ).orElseThrow();

        // Create a new Candidate entity
        Candidate candidate = new Candidate();

        // Set candidate details from the request
        candidate.setName(request.getName());
        candidate.setParty(request.getParty());
        candidate.setLogo(request.getLogo());

        // Associate the candidate with the selected position
        candidate.setPosition(position);

        // Save the candidate into the database
        candidateRepository.save(candidate);

        return "Candidate Added Successfully";
    }


    // -------------------- GET ALL CANDIDATES --------------------

    @Override
    public List<CandidateResponse> getAllCandidates() {

        // Retrieve all candidates from the database
        return candidateRepository.findAll()

                // Convert the List<Candidate> into a stream
                .stream()

                // Convert each Candidate entity into CandidateResponse DTO
                .map(candidate ->
                        new CandidateResponse(
                                candidate.getId(),
                                candidate.getName(),
                                candidate.getParty(),
                                candidate.getLogo(),
                                candidate.isActive(),

                                // Get the position title from the
                                // Candidate -> Position relationship
                                candidate.getPosition()
                                        .getTitle()
                        )
                )

                // Convert the stream back into a List
                .toList();
    }


    // -------------------- DELETE CANDIDATE --------------------

    @Override
    @Transactional
    public String deleteCandidate(Long id) {

        // First delete all votes associated with this candidate.
        // This prevents foreign key constraint violations
        // when the candidate is deleted.
        voteRepository.deleteByCandidateId(id);

        // Now delete the candidate itself
        candidateRepository.deleteById(id);

        return "Candidate Deleted Successfully";
    }
}