package com.raja.Backend.service;

import com.raja.Backend.dto.AuthResponse;
import com.raja.Backend.dto.LoginRequest;
import com.raja.Backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}