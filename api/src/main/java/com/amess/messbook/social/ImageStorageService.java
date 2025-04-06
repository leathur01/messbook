package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.social.exception.StorageException;
import com.amess.messbook.social.exception.StorageFileNotFoundException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class StorageService {

    private static final long MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

    String storeImage(Path uploadPath, MultipartFile image) {
        if (!isImageTypeValid(image)) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("image", "Image size exceeds the maximum allowed size of 1 MB");
            throw new InvalidException(errorDetails);
        }

        if (image.getSize() > MAX_IMAGE_SIZE) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("image", "Invalid image type");
            throw new InvalidException(errorDetails);
        }

        // Filename Sanitization: Use random filename instead of the user-provided one
        String randomFilename = UUID.randomUUID() + "." + image.getOriginalFilename().split("\\.")[1];
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path destinationFile = uploadPath.resolve(Paths.get(randomFilename));
            try (InputStream inputStream = image.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
            return randomFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to update your avatar. Please try again");
        }
    }

    Resource getImage(Path file) {
        Resource resource = new FileSystemResource(file);
        if (resource.exists() || resource.isReadable()) {
            return resource;
        }
        throw new StorageFileNotFoundException("Could not read file");
    }

    MediaType imageTypeToMediaType(String type) {
        Map<String, org.springframework.http.MediaType> responseContentType = new HashMap<>();
        responseContentType.put("jpg", org.springframework.http.MediaType.valueOf(org.springframework.http.MediaType.IMAGE_JPEG_VALUE));
        responseContentType.put("png", org.springframework.http.MediaType.valueOf(org.springframework.http.MediaType.IMAGE_PNG_VALUE));

        return responseContentType.get(type);
    }

    private boolean isImageTypeValid(MultipartFile image) {
        // This also check if the request is empty
        // Quick check for simple file upload attacks
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png");
        if (!allowedTypes.contains(image.getContentType()) || image.getOriginalFilename() == null) {
            return false;
        }

        // The originalFileName cannot be null at this point
        // Check for double extension
        return image.getOriginalFilename().split("\\.").length < 3;
    }
}
