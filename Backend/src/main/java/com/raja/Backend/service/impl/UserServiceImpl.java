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
import com.raja.Backend.exception.EmailAlreadyExistsException;
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    // Repository used to perform database operations on User entity
    @Autowired
    private UserRepository userRepository;

    // Used to hash passwords using BCrypt
    @Autowired
    private PasswordEncoder passwordEncoder;


    // -------------------- ENTITY TO DTO --------------------

    // Converts User entity into UserResponse DTO
    // This prevents exposing the complete User entity to the frontend
    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isBlocked()
        );
    }


    // -------------------- GET ALL USERS --------------------

    @Override
    public List<UserResponse> getAllUsers() {

        // Retrieve all users from the database
        return userRepository.findAll()

                // Convert List<User> into a Stream
                .stream()

                // Convert each User entity into UserResponse DTO
                .map(this::toResponse)

                // Convert the Stream back into a List
                .toList();
    }


    // -------------------- CREATE USER --------------------

    @Override
    public UserResponse createUser(CreateUserRequest request) {

        // Check whether the email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            // Throw custom exception if email already exists
            throw new EmailAlreadyExistsException(
                    "Email already in use: " + request.getEmail()
            );
        }

        // Create a new User entity
        User user = new User();

        // Set user details from the request
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Hash the password before storing it in the database
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // If role is provided, use it.
        // Otherwise, assign USER role by default.
        user.setRole(
                request.getRole() != null
                        ? request.getRole()
                        : Role.USER
        );

        // Save the user into the database
        userRepository.save(user);

        // Convert the saved entity into a response DTO
        return toResponse(user);
    }


    // -------------------- UPDATE USER --------------------

    @Override
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    ) {

        // Find the existing user using the ID
        // If the user does not exist, an exception is thrown
        User user = userRepository.findById(id)
                .orElseThrow();

        // Update name only if a valid name is provided
        if (request.getName() != null
                && !request.getName().isBlank()) {

            user.setName(request.getName());
        }

        // Update role if a new role is provided
        if (request.getRole() != null) {

            user.setRole(request.getRole());
        }

        // Save the updated user
        userRepository.save(user);

        // Return the updated user as a DTO
        return toResponse(user);
    }


    // -------------------- BLOCK USER --------------------

    @Override
    public String blockUser(Long id) {

        // Find the user by ID
        User user = userRepository.findById(id)
                .orElseThrow();

        // Mark the user as blocked
        user.setBlocked(true);

        // Save the updated user
        userRepository.save(user);

        return "User Blocked Successfully";
    }


    // -------------------- UNBLOCK USER --------------------

    @Override
    public String unblockUser(Long id) {

        // Find the user by ID
        User user = userRepository.findById(id)
                .orElseThrow();

        // Mark the user as unblocked
        user.setBlocked(false);

        // Save the updated user
        userRepository.save(user);

        return "User Unblocked Successfully";
    }


    // -------------------- DELETE USER --------------------

    @Override
    public String deleteUser(Long id) {

        // Delete the user using the given ID
        userRepository.deleteById(id);

        return "User Deleted Successfully";
    }
}