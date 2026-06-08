package com.raja.Backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PositionResponse {

    private Long id;

    private String title;

    private String description;

    private Integer maxVotesAllowed;

    private boolean active;

    private LocalDateTime endTime;
}