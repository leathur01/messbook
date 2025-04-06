package com.amess.messbook.social;

import com.amess.messbook.social.exception.StorageException;
import com.amess.messbook.social.exception.StorageFileNotFoundException;
import com.amess.messbook.util.error.ExceptionThrower;
import lombok.RequiredArgsConstructor;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ImageStorageService {

    private final ExceptionThrower exceptionThrower;
    private static final long MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

    String storeImage(Path uploadPath, MultipartFile image) {
        validateImage(image);
        String randomFilename = generateRandomFilename(image); // Filename Sanitization
        try {
            createFileDirectory(uploadPath);
            Path destination = uploadPath.resolve(Paths.get(randomFilename));
            storeToDestination(image, destination);
            return randomFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to update your avatar. Please try again");
        }
    }

    private String generateRandomFilename(MultipartFile image) {
        // OriginalFilename cannot be null
        String fileExtension = image.getOriginalFilename().split("\\.")[1];
        return UUID.randomUUID() + "." + fileExtension;
    }

    private void createFileDirectory(Path uploadPath) throws IOException {
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    private void storeToDestination(MultipartFile image, Path destination) throws IOException {
        try (InputStream inputStream = image.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private void validateImage(MultipartFile image) {
        if (!isImageTypeValid(image)) {
            exceptionThrower.throwInvalidException("image", "Image size exceeds the maximum allowed size of 1 MB");
        }

        if (image.getSize() > MAX_IMAGE_SIZE) {
            exceptionThrower.throwInvalidException("image", "Invalid image type");
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
        if (isSimpleFileUploadAttack(image)) return false;
        return isDoubleExtension(image);
    }

    private boolean isSimpleFileUploadAttack(MultipartFile file) {
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png");
        return !allowedTypes.contains(file.getContentType()) || file.getOriginalFilename() == null;
    }

    private boolean isDoubleExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) return false;
        return originalFilename.split("\\.").length < 3;
    }
}
