package com.raja.Backend.dto;

import com.raja.Backend.entity.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String name;

    private Role role;
}