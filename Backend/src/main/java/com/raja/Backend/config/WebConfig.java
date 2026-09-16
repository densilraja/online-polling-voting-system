package com.raja.Backend.config;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Configure how Spring Boot should serve uploaded files
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Physical folder where uploaded files are stored
        // user.home makes the path independent of the project location
        String uploadLocation =
                "file:" + System.getProperty("user.home")
                + "/votex-uploads/";

        // Map the URL /uploads/** to the physical upload folder
        // Example:
        // /uploads/candidate.jpg
        //        ↓
        // <user-home>/votex-uploads/candidate.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }
}