package com.raja.Backend.dto;

import lombok.Data;

@Data
public class CandidateRequest {

    private String name;

    private String party;

    private String logo;

    private Long positionId;
}