package com.raja.Backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.raja.Backend.security.CustomUserDetailsService;
import com.raja.Backend.security.JwtAuthenticationFilter;


@Configuration
public class SecurityConfig {

    // Custom JWT filter checks the JWT from incoming requests
    private final JwtAuthenticationFilter jwtAuthFilter;

    // Loads user information from the database during authentication
    private final CustomUserDetailsService customUserDetailsService;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            CustomUserDetailsService customUserDetailsService
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.customUserDetailsService = customUserDetailsService;
    }


    // Defines which frontend origin can communicate with the backend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from the React frontend
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173")
        );

        // Allow these HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));

        // Allow all request headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials when required
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Apply this CORS configuration to all backend endpoints
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


    // Defines the complete Spring Security filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

                // Enable CORS using the configuration defined above
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // Disable CSRF because this application uses
                // stateless JWT authentication
                .csrf(csrf -> csrf.disable())

                // Define authentication and authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Login and registration don't require authentication
                        .requestMatchers("/auth/**").permitAll()

                        // Uploaded images are publicly accessible
                        .requestMatchers("/uploads/**").permitAll()

                        // Swagger endpoints are publicly accessible
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Only ADMIN users can access admin APIs
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        // USER and ADMIN can access user APIs
                        .requestMatchers("/user/**")
                        .hasAnyRole("USER", "ADMIN")

                        // Only ADMIN users can access results APIs
                        .requestMatchers("/results/**")
                        .hasRole("ADMIN")

                        // Any other endpoint requires authentication
                        .anyRequest().authenticated()
                )

                // Don't maintain server-side login sessions
                // because authentication is handled using JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Use our DAO authentication provider
                .authenticationProvider(authenticationProvider())

                // Run JWT authentication before Spring's default
                // username/password authentication filter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        // Build and return the SecurityFilterChain
        return http.build();
    }


    // Provides BCrypt password hashing for registration
    // and password verification during login
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // Provides the main authentication manager
    // which coordinates the authentication process
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }


    // Defines how Spring should authenticate users
    @Bean
    public AuthenticationProvider authenticationProvider() {

        // DAO provider loads the user from the database
        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        // Tell the provider how to find the user
        authProvider.setUserDetailsService(
                customUserDetailsService
        );

        // Tell the provider how to verify the password
        authProvider.setPasswordEncoder(
                passwordEncoder()
        );

        return authProvider;
    }
}