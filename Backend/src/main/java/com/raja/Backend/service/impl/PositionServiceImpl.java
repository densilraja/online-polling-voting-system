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

    // Repository used to perform database operations
    // on the Position entity
    @Autowired
    private PositionRepository positionRepository;


    // -------------------- ADD POSITION --------------------

    @Override
    public String addPosition(PositionRequest request) {

        // Create a new Position entity
        Position position = new Position();

        // Set position details from the request DTO
        position.setTitle(request.getTitle());
        position.setDescription(
                request.getDescription()
        );

        // Set the maximum number of votes allowed
        position.setMaxVotesAllowed(
                request.getMaxVotesAllowed()
        );

        // Set whether the position/election is active
        position.setActive(request.isActive());

        // Set the election end time
        position.setEndTime(
                request.getEndTime()
        );

        // Save the position into the database
        positionRepository.save(position);

        return "Position Added Successfully";
    }


    // -------------------- GET ALL POSITIONS --------------------

    @Override
    public List<PositionResponse> getAllPositions() {

        // Fetch all positions from the database
        return positionRepository.findAll()

                // Convert List<Position> into a Stream
                .stream()

                // Convert each Position entity
                // into a PositionResponse DTO
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

                // Convert the Stream back into a List
                .toList();
    }


    // -------------------- DELETE POSITION --------------------

    @Override
    public String deletePosition(Long id) {

        // Delete the position using its ID
        positionRepository.deleteById(id);

        return "Position Deleted Successfully";
    }


    // -------------------- UPDATE POSITION --------------------

    @Override
    public String updatePosition(
            Long id,
            PositionRequest request
    ) {

        // Find the existing position using its ID
        // If the position does not exist, an exception is thrown
        Position position = positionRepository.findById(id)
                .orElseThrow();

        // Update the existing position with
        // values received from the request
        position.setTitle(request.getTitle());

        position.setDescription(
                request.getDescription()
        );

        position.setMaxVotesAllowed(
                request.getMaxVotesAllowed()
        );

        position.setActive(
                request.isActive()
        );

        position.setEndTime(
                request.getEndTime()
        );

        // Save the updated position
        positionRepository.save(position);

        return "Position Updated Successfully";
    }
}