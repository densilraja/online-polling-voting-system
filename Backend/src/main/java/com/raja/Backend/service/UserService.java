package com.raja.Backend.service;

import java.util.List;

import com.raja.Backend.dto.CreateUserRequest;
import com.raja.Backend.dto.UpdateUserRequest;
import com.raja.Backend.dto.UserResponse;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse createUser(CreateUserRequest request); // ← NEW

    UserResponse updateUser(Long id, UpdateUserRequest request);

    String blockUser(Long id);

    String unblockUser(Long id);

    String deleteUser(Long id);
}