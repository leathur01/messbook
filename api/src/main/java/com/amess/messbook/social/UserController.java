package com.amess.messbook.social;

import com.amess.messbook.notification.Device;
import com.amess.messbook.notification.DeviceRepository;
import com.amess.messbook.social.dto.*;
import com.amess.messbook.social.entity.User;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.*;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final ModelMapper modelMapper;
    private final UserService userService;
    private final UserRepository userRepository;
    private final FirebaseMessaging firebaseMessaging;
    private final DeviceRepository deviceRepository;

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

        var user = optionalUser.get();
        List<Device> devicesOfUser = deviceRepository.findByUserId(userId);
        for (Device device : devicesOfUser) {
            Message message = Message.builder()
                    .putData("title", "A new friend request")
                    .putData("body", user.getNickname())
                    .setToken(device.getDeviceToken())
                    .build();

            String sentMessage = "";
            try {
                sentMessage= firebaseMessaging.send(message);
            } catch (FirebaseMessagingException e) {
                deviceRepository.deleteById(device.getId());
            }
            System.out.println("Successfully sent message: " + sentMessage);
        }

        var userDTO = modelMapper.map(optionalUser.get(), UserDTO.class);
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
