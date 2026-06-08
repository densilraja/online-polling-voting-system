package com.raja.Backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/upload")
@CrossOrigin("*")
public class FileUploadController {

    private static final String UPLOAD_DIR =
            System.getProperty("user.home") + "/votex-uploads/";

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        String fileUrl = "http://localhost:8080/uploads/" + filename;
        return ResponseEntity.ok(fileUrl);
    }
}