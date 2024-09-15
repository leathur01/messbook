package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.auth.TokenService;
import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.auth.entity.TokenScope;
import com.amess.messbook.social.entity.User;
import com.amess.messbook.social.exception.StorageException;
import com.amess.messbook.social.exception.StorageFileNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.MulticastChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getForToken(byte[] hash, String scope, LocalDateTime currentTime) {
        return userRepository.getForToken(hash, scope, currentTime);
    }

    public List<User> findExistedAccounts(String nickname, String email, String phoneNumber) {
        return userRepository.findExistedAccounts(nickname, email, phoneNumber);
    }

    public Optional<User> findById(UUID userId) {
        return userRepository.findById(userId);
    }

    public void resetPassword(Token token, String password) {
        Optional<User> user = getForToken(
                DigestUtils.sha256(token.getPlainText()),
                TokenScope.PASSWORD_RESET.getScope(),
                LocalDateTime.now()
        );

        if (user.isEmpty()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("token", "invalid or expired activation token");
            throw new InvalidException(errorDetails);
        }

        user.get().setPassword(passwordEncoder.encode(password));
        var updatedUser = save(user.get());

        tokenService.deleteAllForUser(updatedUser.getId(), TokenScope.PASSWORD_RESET.getScope());
    }

    public User updateUser(UUID userId, String bio, LocalDate dateOfBirth) throws NoResourceFoundException {
        Optional<User> optionalUser = findById(userId);

        if (optionalUser.isEmpty()) {
            throw new NoResourceFoundException(null, null);
        }
        var user = optionalUser.get();

        if (bio != null) {
            user.setBio(bio);
        }

        if (dateOfBirth != null) {
            user.setDateOfBirth(dateOfBirth);
        }

        return save(user);
    }

    public void updatePassword(UUID userId, String currentPassword, String newPassword) throws NoResourceFoundException {
        var user = checkPassword(userId, currentPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        save(user);
    }

    public void deleteUser(UUID userId, String password) throws NoResourceFoundException {
        var user = checkPassword(userId, password);
        userRepository.deleteById(user.getId());
    }

    public User updateNickname(
            UUID userId,
            String password,
            String newNickname
    ) throws NoResourceFoundException {
        var user = checkPassword(userId, password);

        if (!user.getNickname().equals(newNickname)) {
            if (!isExistedByNickname(newNickname)) {
                user.setNickname(newNickname);
            }
        }

        return save(user);
    }

    private boolean isExistedByNickname(String nickname) {
        List<User> existedAccounts = findExistedAccounts(nickname, "", "");
        if (!existedAccounts.isEmpty()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("nickname", "Nickname is unavailable. Try adding numbers, letters, underscores, or periods.");
            throw  new InvalidException(errorDetails);
        }

        return false;
    }

    private User checkPassword(UUID userId, String password) throws NoResourceFoundException {
        // TODO: Refactor to use the authenticated user in the security context
        // Then authorize if the authenticated user is allowed to act on the resource
        var optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            throw new NoResourceFoundException(null, null);
        }
        var user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.addError("password", "Password does not match");
            throw new InvalidException(errorDetails);
        }

        return user;
    }

    void updateAvatar(UUID userId, MultipartFile image) throws NoResourceFoundException {
        // This also check if the request is empty
        // Quick check for simple file upload attacks
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png");
        if (!allowedTypes.contains(image.getContentType()) || image.getOriginalFilename() == null) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("image", "Invalid image type");
            throw new InvalidException(errorDetails);
        }

        // The originalFileName cannot be null at this point
        // Check for double extension
        if (image.getOriginalFilename().split("\\.").length > 3) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("image", "Invalid image type");
            throw new InvalidException(errorDetails);
        }

        // Filename Sanitization: Use random filename instead of the user-provided one
        String randomFilename = UUID.randomUUID() + "." + image.getOriginalFilename().split("\\.")[1];
        try {
            Path uploadPath = Paths.get("user-images/" + userId.toString());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path destinationFile = uploadPath.resolve(Paths.get(randomFilename));
            try (InputStream inputStream = image.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new StorageException("Failed to update your avatar. Please try again");
        }

        var optionalUser = findById(userId);
        if (optionalUser.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }

        var user = optionalUser.get();
        user.setAvatarFilePath(randomFilename);
        userRepository.save(user);
    }
}