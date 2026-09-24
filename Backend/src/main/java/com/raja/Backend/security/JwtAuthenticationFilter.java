package com.raja.Backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // This method runs once for every incoming HTTP request
    // and checks whether the request contains a JWT
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get the JWT from the Authorization header
        final String authHeader
                = request.getHeader("Authorization");

        // If there is no JWT, continue the request normally
        // Public endpoints can continue without authentication
        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            // Remove "Bearer " and keep only the actual JWT
            String jwt = authHeader.substring(7);

            // Extract the user's email from the JWT subject
            String userEmail
                    = jwtService.extractUsername(jwt);

            // Only authenticate if no authentication
            // has already been set for this request
            if (userEmail != null
                    && SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Load the user from the database using the email
                UserDetails userDetails
                        = customUserDetailsService
                                .loadUserByUsername(userEmail);

                // Validate the JWT before trusting the user
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // Create an Authentication object containing
                    // the user and their authorities/roles
                    UsernamePasswordAuthenticationToken authToken
                            = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Attach request details to the authentication object
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Store the authenticated user in SecurityContext
                    // Spring Security uses this information for authorization
                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                }
            }

        } catch (ExpiredJwtException e) {

            // If the JWT is expired, don't authenticate the request.
            // Continue the filter chain so Spring Security can
            // handle protected endpoints normally.
            filterChain.doFilter(request, response);
            return;
        }

        // Continue to the next security filter/controller
        filterChain.doFilter(request, response);
    }
}
