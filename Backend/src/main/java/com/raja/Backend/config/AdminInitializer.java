package com.raja.Backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.raja.Backend.entity.Role;
import com.raja.Backend.entity.User;
import com.raja.Backend.repository.UserRepository;

@Configuration
public class AdminInitializer {

    // Runs automatically when the Spring Boot application starts
    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Email used to identify the default admin account
            String adminEmail = "admin@votex.com";

            // Check whether the admin account already exists
            // This prevents creating duplicate admin accounts on every startup
            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                // Create a new User object for the admin
                User admin = new User();

                // Set the admin's basic information
                admin.setName("System Admin");
                admin.setEmail(adminEmail);

                // Hash the password before storing it in the database
                // The plain password is never stored
                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                // Assign ADMIN role so Spring Security can authorize admin APIs
                admin.setRole(Role.ADMIN);

                // Admin is active by default
                admin.setBlocked(false);

                // Save the admin account into MySQL
                userRepository.save(admin);

                // Print confirmation in the console
                System.out.println("=================================");
                System.out.println("ADMIN ACCOUNT CREATED");
                System.out.println("Email    : admin@votex.com");
                System.out.println("Password : Admin@123");
                System.out.println("=================================");

            } else {

                // Admin already exists, so don't create another one
                System.out.println("Admin account already exists.");
            }
        };
    }
}