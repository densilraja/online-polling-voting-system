package com.raja.Backend.service;

import java.util.List;

import com.raja.Backend.dto.CandidateRequest;
import com.raja.Backend.dto.CandidateResponse;

public interface CandidateService {

    String addCandidate(CandidateRequest request);

    List<CandidateResponse> getAllCandidates();

    String deleteCandidate(Long id);
}