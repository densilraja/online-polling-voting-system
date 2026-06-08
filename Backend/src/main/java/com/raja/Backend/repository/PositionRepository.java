package com.raja.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raja.Backend.entity.Position;

public interface PositionRepository
        extends JpaRepository<Position, Long> {

}