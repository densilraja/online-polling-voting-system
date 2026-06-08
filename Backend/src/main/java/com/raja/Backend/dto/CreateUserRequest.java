package com.raja.Backend.dto;

import com.raja.Backend.entity.Role;
import lombok.Data;

@Data
public class CreateUserRequest {

    private String name;

    private String email;

    private String password;

    private Role role; // USER or ADMIN
}