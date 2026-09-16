package com.raja.Backend.security;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.raja.Backend.entity.User;
import com.raja.Backend.repository.UserRepository;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    // Spring Security calls this method when it needs
    // to load a user during authentication
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Find the user in the database using the email
        // If the user doesn't exist, authentication fails
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );


        // Convert our application's User entity
        // into Spring Security's UserDetails object
        return org.springframework.security.core.userdetails.User
                .builder()

                // Email is used as the username in Spring Security
                .username(user.getEmail())

                // Return the already BCrypt-hashed password
                // Spring Security uses it to verify the login password
                .password(user.getPassword())

                // Convert our application's role into
                // Spring Security's authority format
                .authorities(
                        "ROLE_" + user.getRole().name()
                )

                .build();
    }
}