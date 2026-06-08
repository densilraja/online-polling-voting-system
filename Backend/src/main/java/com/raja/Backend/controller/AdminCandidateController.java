package com.raja.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.raja.Backend.dto.CandidateRequest;
import com.raja.Backend.dto.CandidateResponse;
import com.raja.Backend.service.CandidateService;

@RestController
@RequestMapping("/admin/candidates")
@CrossOrigin("*")
public class AdminCandidateController {

    @Autowired
    private CandidateService candidateService;

    @PostMapping
    public String addCandidate(
            @RequestBody CandidateRequest request
    ) {

        return candidateService.addCandidate(request);
    }

    @GetMapping
    public List<CandidateResponse> getAllCandidates() {

        return candidateService.getAllCandidates();
    }

    @DeleteMapping("/{id}")
    public String deleteCandidate(
            @PathVariable Long id
    ) {

        return candidateService.deleteCandidate(id);
    }
}