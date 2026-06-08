package com.raja.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.raja.Backend.entity.Vote;
import com.raja.Backend.service.VoteService;
import com.raja.Backend.service.PositionService;
import com.raja.Backend.service.CandidateService;
import com.raja.Backend.dto.PositionResponse;
import com.raja.Backend.dto.CandidateResponse;

@RestController
@RequestMapping("/user")
public class UserVoteController {

    @Autowired
    private VoteService voteService;

    @Autowired
    private PositionService positionService;

    @Autowired
    private CandidateService candidateService;

    @PostMapping("/votes/{userId}/{candidateId}")
    public String castVote(
            @PathVariable Long userId,
            @PathVariable Long candidateId
    ) {
        return voteService.castVote(userId, candidateId);
    }

    @GetMapping("/votes/position/{positionId}")
    public List<Vote> getVotesByPosition(
            @PathVariable Long positionId
    ) {
        return voteService.getVotesByPosition(positionId);
    }

    @GetMapping("/positions")
    public List<PositionResponse> getPositions() {
        return positionService.getAllPositions();
    }

    @GetMapping("/candidates")
    public List<CandidateResponse> getCandidates() {
        return candidateService.getAllCandidates();
    }
}