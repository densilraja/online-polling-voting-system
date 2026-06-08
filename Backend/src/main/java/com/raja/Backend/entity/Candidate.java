package com.raja.Backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String party;

    private String logo;

    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;
}