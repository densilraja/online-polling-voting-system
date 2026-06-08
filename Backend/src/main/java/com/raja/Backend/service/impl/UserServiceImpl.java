package com.raja.Backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.raja.Backend.dto.CreateUserRequest;
import com.raja.Backend.dto.UpdateUserRequest;
import com.raja.Backend.dto.UserResponse;
import com.raja.Backend.entity.Role;
import com.raja.Backend.entity.User;
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── Helper: convert User → UserResponse ──────────────────
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isBlocked()
        );
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── NEW: Admin creates a user with any role ───────────────
    @Override
    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email already in use: " + request.getEmail()
            );
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Default to USER if no role provided
        user.setRole(
                request.getRole() != null ? request.getRole() : Role.USER
        );

        userRepository.save(user);

        return toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {

        User user = userRepository.findById(id).orElseThrow();

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        userRepository.save(user);

        return toResponse(user);
    }

    @Override
    public String blockUser(Long id) {

        User user = userRepository.findById(id).orElseThrow();
        user.setBlocked(true);
        userRepository.save(user);
        return "User Blocked Successfully";
    }

    @Override
    public String unblockUser(Long id) {

        User user = userRepository.findById(id).orElseThrow();
        user.setBlocked(false);
        userRepository.save(user);
        return "User Unblocked Successfully";
    }

    @Override
    public String deleteUser(Long id) {

        userRepository.deleteById(id);
        return "User Deleted Successfully";
    }
}