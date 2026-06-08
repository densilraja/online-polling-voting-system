package com.raja.Backend.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PositionRequest {

    private String title;

    private String description;

    private Integer maxVotesAllowed;

    private boolean active;

    private LocalDateTime endTime;
}