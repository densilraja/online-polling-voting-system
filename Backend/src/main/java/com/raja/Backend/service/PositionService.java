package com.raja.Backend.service;

import java.util.List;

import com.raja.Backend.dto.PositionRequest;
import com.raja.Backend.dto.PositionResponse;

public interface PositionService {

    String addPosition(PositionRequest request);

    List<PositionResponse> getAllPositions();

    String deletePosition(Long id);

    String updatePosition(
            Long id,
            PositionRequest request
    );
}