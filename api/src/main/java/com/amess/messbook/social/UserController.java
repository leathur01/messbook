package com.amess.messbook.social;

import com.amess.messbook.social.dto.*;
import com.amess.messbook.social.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final ModelMapper modelMapper;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ImageStorageService storageService;

    @GetMapping("/")
    public String hello() {
        return "Hi there";
    }

    // -- Account Management --
    @GetMapping("users")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("users/{userId}")
    public UserDTO getUser(@PathVariable UUID userId) throws NoResourceFoundException {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }

        return modelMapper.map(optionalUser.get(), UserDTO.class);
    }

    @GetMapping(
            value = "users/{userId}/avatar",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public ResponseEntity<?> getUserAvatar(@PathVariable UUID userId) throws NoResourceFoundException {
        Resource resource = userService.getAvatar(userId);
        String filename = resource.getFilename();
        // filename cannot be null at this point
        String imageType = filename.split("\\.")[1];
        return ResponseEntity.ok()
                .contentType(storageService.imageTypeToMediaType(imageType))
                .body(resource);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("users/{userId}")
    public UserDTO updateAccount(
            @PathVariable UUID userId,
            @RequestBody @Valid UserUpdateData request
    ) throws NoResourceFoundException {
        var updatedUser = userService.updateUser(
                userId,
                request.getBio(),
                request.getDateOfBirth()
        );
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @PutMapping("users/{userId}/nickname")
    public UserDTO updateNickname(
            @PathVariable UUID userId,
            @RequestBody @Valid NicknameUpdateData request
    ) throws NoResourceFoundException {
        var updatedUser = userService.updateNickname(
                userId,
                request.getPassword(),
                request.getNewNickname()
        );
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    // Update password but requiring re-authentication using the old password
    @PutMapping("users/{userId}/password")
    public HashMap<String, String> updatePassword(
            @PathVariable UUID userId,
            @RequestBody @Valid PasswordUpdateData request
    ) throws NoResourceFoundException {
        userService.updatePassword(
                userId,
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        var response = new HashMap<String, String>();
        response.put("message", "your password has been successfully changed");
        return response;
    }

    // Update password using token
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("users/reset-password")
    public Map<String, String> resetPassword(@RequestBody @Valid PasswordResetData request) {
        userService.resetPassword(request.getToken(), request.getPassword());
        var response = new HashMap<String, String>();
        response.put("message", "your password has been successfully reset");
        return response;
    }

    @PutMapping("users/{userId}/avatar")
    public UserDTO updateAvatar(
            @PathVariable UUID userId,
            @RequestParam("image") MultipartFile image
    ) throws NoResourceFoundException {
        User user =  userService.updateAvatar(userId, image);
        return modelMapper.map(user, UserDTO.class);
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("users/{userId}")
    public HashMap<String, String> deleteAccount(
            @PathVariable UUID userId,
            @RequestBody @Valid DeleteAccountData request
    ) throws NoResourceFoundException {
        userService.deleteUser(userId, request.getPassword());
        var response = new HashMap<String, String>();
        response.put("message", "You account has beenn deleted. You will not be able to use this account again");
        return response;
    }
}
