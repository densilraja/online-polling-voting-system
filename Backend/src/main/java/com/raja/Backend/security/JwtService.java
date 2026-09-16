package com.raja.Backend.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Secret key used to digitally sign and validate JWT tokens
    private static final String SECRET_KEY =
            "VGhpc0lzQVNlY3JldEtleUZvckpXVFRva2VuR2VuZXJhdGlvbg==";


    // Generate JWT Token
    public String generateToken(String email) {

        return Jwts.builder()

                // Store the user's email as the subject of the token
                .setSubject(email)

                // Store when the token was created
                .setIssuedAt(new Date())

                // Token will expire after 7 days
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60 * 24 * 7
                        )
                )

                // Sign the token using the secret key and HS256 algorithm
                .signWith(
                        getSignKey(),
                        SignatureAlgorithm.HS256
                )

                // Convert the JWT builder into the final String token
                .compact();
    }


    // Extract the username/email from the JWT
    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    // Extract the expiration date from the JWT
    public Date extractExpiration(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }


    // Generic method used to extract any claim from the token
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        // Extract all claims from the JWT
        final Claims claims = extractAllClaims(token);

        // Get the required claim from those claims
        return claimsResolver.apply(claims);
    }


    // Check whether the token belongs to the authenticated user
    // and whether the token has expired
    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }


    // Check whether the JWT expiration time has passed
    public boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }


    // Extract all claims after validating the JWT signature
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()

                // Use the same secret key that was used to sign the token
                .setSigningKey(getSignKey())

                // Create the JWT parser
                .build()

                // Parse and validate the signed JWT
                .parseClaimsJws(token)

                // Get the payload/claims from the JWT
                .getBody();
    }


    // Convert the Base64 secret into a cryptographic signing key
    private Key getSignKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}