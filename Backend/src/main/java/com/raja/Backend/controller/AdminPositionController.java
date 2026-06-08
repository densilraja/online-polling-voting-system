package com.raja.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.raja.Backend.dto.PositionRequest;
import com.raja.Backend.dto.PositionResponse;
import com.raja.Backend.service.PositionService;

@RestController
@RequestMapping("/admin/positions")
@CrossOrigin("*")
public class AdminPositionController {

    @Autowired
    private PositionService positionService;

    @PostMapping
    public String addPosition(
            @RequestBody PositionRequest request
    ) {

        return positionService.addPosition(request);
    }

    @GetMapping
    public List<PositionResponse> getAllPositions() {

        return positionService.getAllPositions();
    }

    @PutMapping("/{id}")
    public String updatePosition(
            @PathVariable Long id,
            @RequestBody PositionRequest request
    ) {

        return positionService.updatePosition(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public String deletePosition(
            @PathVariable Long id
    ) {

        return positionService.deletePosition(id);
    }
}