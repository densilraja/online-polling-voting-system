package com.raja.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateResponse {

    private Long id;

    private String name;

    private String party;

    private String logo;

    private boolean active;

    private String positionTitle;
}