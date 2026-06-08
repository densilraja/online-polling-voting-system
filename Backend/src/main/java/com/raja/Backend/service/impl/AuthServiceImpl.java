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
import com.raja.Backend.repository.UserRepository;
import com.raja.Backend.security.JwtService;
import com.raja.Backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.USER);

        userRepository.save(user);

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getPassword()
                )
        );

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                ).orElseThrow();

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName());
    }
}