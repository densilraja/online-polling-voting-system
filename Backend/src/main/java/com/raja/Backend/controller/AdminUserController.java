package com.raja.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.raja.Backend.dto.CreateUserRequest;
import com.raja.Backend.dto.UpdateUserRequest;
import com.raja.Backend.dto.UserResponse;
import com.raja.Backend.service.UserService;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin("*")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // ── NEW: Create user (USER or ADMIN) ──────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(
            @RequestBody CreateUserRequest request
    ) {
        try {
            return userService.createUser(request);
        } catch (RuntimeException e) {
            // Email already exists
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, e.getMessage()
            );
        }
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        return userService.updateUser(id, request);
    }

    @PutMapping("/block/{id}")
    public String blockUser(@PathVariable Long id) {
        return userService.blockUser(id);
    }

    @PutMapping("/unblock/{id}")
    public String unblockUser(@PathVariable Long id) {
        return userService.unblockUser(id);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
}