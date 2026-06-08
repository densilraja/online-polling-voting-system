package com.raja.Backend.dto;

import com.raja.Backend.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private boolean blocked;
}