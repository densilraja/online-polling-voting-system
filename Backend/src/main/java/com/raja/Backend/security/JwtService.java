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

    private static final String SECRET_KEY =
            "VGhpc0lzQVNlY3JldEtleUZvckpXVFRva2VuR2VuZXJhdGlvbg==";

    // Generate JWT Token
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60 * 24 * 7 // 7 Days
                        )
                )
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    // Extract Expiration Date
    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    // Generic Claim Extractor
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // Validate Token
    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    // Check Expiry
    public boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    // Extract All Claims
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Secret Key
    private Key getSignKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}