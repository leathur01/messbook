package com.amess.messbook.social;

import com.amess.messbook.social.dto.*;
import com.amess.messbook.social.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final ModelMapper userMapper;
    private final UserService userService;
    private final UserRepository userRepository;

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
    public UserDTO getUser(@PathVariable UUID userId) {
        var user = userService.findById(userId);
        var userDTO = userMapper.map(user, UserDTO.class);

        return userDTO;
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
        var userDTO = userMapper.map(updatedUser, UserDTO.class);

        return userDTO;
    }

    @PutMapping("users/{userId}/nickname")
    public HashMap<String, String> updateNickname(
            @PathVariable UUID userId,
            @RequestBody @Valid NicknameUpdateData request
    ) throws NoResourceFoundException {
        var user = userService.updateNickname(
                userId,
                request.getPassword(),
                request.getNewNickname()
        );
        var response = new HashMap<String, String>();
        response.put("message", user.getNickname() + " is your new nickname");

        return response;
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
