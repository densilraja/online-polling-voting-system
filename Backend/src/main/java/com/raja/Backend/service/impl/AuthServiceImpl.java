package com.raja.Backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.raja.Backend.dto.AuthResponse;
import com.raja.Backend.dto.LoginRequest;
import com.raja.Backend.dto.RegisterRequest;
import com.raja.Backend.entity.Role;
import com.raja.Backend.entity.User;
import com.raja.Backend.exception.EmailAlreadyExistsException;
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.security.JwtService;
import com.raja.Backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    // Used to perform database operations on User entity
    @Autowired
    private UserRepository userRepository;

    // Used to hash passwords using BCrypt
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Used to generate JWT token after successful authentication
    @Autowired
    private JwtService jwtService;

    // Used to authenticate the user's email and password
    @Autowired
    private AuthenticationManager authenticationManager;


    // -------------------- REGISTER --------------------

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check whether the email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            // Throw custom exception if email already exists
            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }

        // Create a new User object
        User user = new User();

        // Set user details from the registration request
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Hash the password before storing it in the database
        // The original password is not stored
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // New users are assigned USER role by default
        user.setRole(Role.USER);

        // Save the user into the database
        userRepository.save(user);

        // Generate JWT token using the user's email
        String token = jwtService.generateToken(
                user.getEmail()
        );

        // Return authentication response to the frontend
        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName()
        );
    }


    // -------------------- LOGIN --------------------

    @Override
    public AuthResponse login(LoginRequest request) {

        // Authenticate the email and password.
        // AuthenticationManager delegates the authentication
        // to the configured AuthenticationProvider.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If authentication succeeds, find the user from database
        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow();

        // Generate JWT token after successful authentication
        String token = jwtService.generateToken(
                user.getEmail()
        );

        // Return JWT token and user information to frontend
        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName()
        );
    }
}