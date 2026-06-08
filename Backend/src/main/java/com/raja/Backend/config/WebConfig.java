package com.raja.Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Must match the UPLOAD_DIR in FileUploadController exactly.
        // Using an absolute path ensures files are always found regardless
        // of where the app is launched from.
        String uploadLocation = "file:" + System.getProperty("user.home") + "/votex-uploads/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }
}