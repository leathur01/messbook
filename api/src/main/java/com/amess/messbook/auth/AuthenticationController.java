package com.amess.messbook.auth;

import com.amess.messbook.auth.dto.AccountRegistrationData;
import com.amess.messbook.auth.dto.AuthenticationData;
import com.amess.messbook.auth.dto.PasswordRecoveryRequest;
import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.social.dto.UserDTO;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class AuthenticationController {

    private final ModelMapper userMapper;
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public UserDTO register(@RequestBody @Valid AccountRegistrationData request) throws MessagingException {
        var createdUser = authenticationService.register(request);
        return userMapper.map(createdUser, UserDTO.class);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/activate")
    public UserDTO activate(@RequestBody @Valid Token validationToken) throws MethodArgumentNotValidException {
        var updatedUser = authenticationService.activate(validationToken);
        var userDTO = userMapper.map(updatedUser, UserDTO.class);

        return userDTO;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/log-in")
    public Map<String, String> authenticate(@RequestBody @Valid AuthenticationData request) {
        String jws = authenticationService.authenticate(request.getEmail(), request.getPassword());
        var response = new HashMap<String, String>();
        response.put("authenticationToken", jws);

        return response;
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/password-reset")
    public HashMap<String, String> resetPassword(@RequestBody @Valid PasswordRecoveryRequest request) throws MessagingException {
        authenticationService.requestResetPassword(request.getEmail());
        var response = new HashMap<String, String>();
        response.put("message", "If that email address is in our database, we will send you an email to reset your password.");

        return response;
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/log-out") // Idempotent behaviour -> Use Put instead of Post
    public Map<String, String> logout(@RequestHeader("Authorization") String authHeader) {

        // We don't need to validate the jwt in this end-point
        // Because the jwt has been authenticated in the jwt filter before getting to this point
        String encodedJwt = authHeader.substring(7);
        jwtService.revokeJwt(encodedJwt);

        var response = new HashMap<String, String>();
        response.put("message", "you have been logged out from messbook");

        return response;
    }
}
