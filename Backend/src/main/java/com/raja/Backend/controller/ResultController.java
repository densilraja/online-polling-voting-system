package com.raja.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.raja.Backend.dto.VoteResultDTO;
import com.raja.Backend.service.VoteService;

@RestController
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private VoteService voteService;

    @GetMapping("/position/{positionId}")
    public List<VoteResultDTO> getResults(
            @PathVariable Long positionId
    ) {

        return voteService
                .getResultsByPosition(positionId);
    }

    @GetMapping("/winner/{positionId}")
    public VoteResultDTO getWinner(
            @PathVariable Long positionId
    ) {

        return voteService
                .getWinner(positionId);
    }

    @GetMapping("/total-votes")
    public Long getTotalVotes() {

        return voteService
                .getTotalVotes();
    }

    @GetMapping("/total-voters")
    public Long getTotalVoters() {

        return voteService
                .getTotalVoters();
    }
}