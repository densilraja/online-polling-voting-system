package com.raja.Backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raja.Backend.dto.PositionRequest;
import com.raja.Backend.dto.PositionResponse;
import com.raja.Backend.entity.Position;
import com.raja.Backend.repository.PositionRepository;
import com.raja.Backend.service.PositionService;

@Service
public class PositionServiceImpl
        implements PositionService {

    @Autowired
    private PositionRepository positionRepository;

    @Override
    public String addPosition(
            PositionRequest request
    ) {

        Position position = new Position();

        position.setTitle(request.getTitle());

        position.setDescription(
                request.getDescription()
        );

        position.setMaxVotesAllowed(
                request.getMaxVotesAllowed()
        );

        position.setActive(request.isActive());

        position.setEndTime(request.getEndTime());

        positionRepository.save(position);

        return "Position Added Successfully";
    }

    @Override
    public List<PositionResponse> getAllPositions() {

        return positionRepository.findAll()
                .stream()
                .map(position ->
                        new PositionResponse(
                                position.getId(),
                                position.getTitle(),
                                position.getDescription(),
                                position.getMaxVotesAllowed(),
                                position.isActive(),
                                position.getEndTime()
                        )
                )
                .toList();
    }

    @Override
    public String deletePosition(Long id) {

        positionRepository.deleteById(id);

        return "Position Deleted Successfully";
    }

    @Override
    public String updatePosition(
            Long id,
            PositionRequest request
    ) {

        Position position =
                positionRepository.findById(id)
                        .orElseThrow();

        position.setTitle(request.getTitle());

        position.setDescription(
                request.getDescription()
        );

        position.setMaxVotesAllowed(
                request.getMaxVotesAllowed()
        );

        position.setActive(request.isActive());

        position.setEndTime(request.getEndTime());

        positionRepository.save(position);

        return "Position Updated Successfully";
    }
}