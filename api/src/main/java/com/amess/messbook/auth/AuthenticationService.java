package com.amess.messbook.auth;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.auth.entity.TokenScope;
import com.amess.messbook.email.EmailService;
import com.amess.messbook.email.EmailSubject;
import com.amess.messbook.email.EmailTemplateName;
import com.amess.messbook.email.entity.Email;
import com.amess.messbook.social.UserService;
import com.amess.messbook.social.entity.User;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String authenticate(String email, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
        Authentication auth = authenticationManager.authenticate(authenticationToken);
        var authenticatedUser = (User) auth.getPrincipal();

        return jwtService.newAuthenticationToken(authenticatedUser.getId());
    }

    public User register(
            String nickname,
            String email,
            String phoneNumber,
            String password,
            LocalDate dateOfBirth
    ) throws MessagingException {

        var user = User.builder()
                .nickname(nickname)
                .email(email)
                .phoneNumber(phoneNumber)
                .password(passwordEncoder.encode(password))
                .bio("")
                .dateOfBirth(dateOfBirth)
                .activated(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        var errorDetails = validateAccountExistence(user);
        if (!errorDetails.getErrors().isEmpty()) {
            throw new InvalidException(errorDetails);
        }

        User savedUser = userService.save(user);

        var token = tokenService.newToken(
                user.getId(),
                Duration.ofDays(3),
                TokenScope.ACTIVATION.getScope()
        );

        Email welcomeEmail = emailService.createEmail(user.getEmail(), user.getNickname(), token, EmailSubject.WELCOME, EmailTemplateName.ACCOUNT_ACTIVATION);
        emailService.sendEmail(welcomeEmail);
        return savedUser;
    }

    public User activate(Token validationToken) {
        Optional<User> user = userService.getForToken(
                DigestUtils.sha256(validationToken.getPlainText()),
                TokenScope.ACTIVATION.getScope(),
                LocalDateTime.now()
        );

        if (!user.isPresent()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("token", "invalid or expired activation token");
            throw new InvalidException(errorDetails);
        }

        user.get().setActivated(true);
        var updatedUser = userService.save(user.get());
        tokenService.deleteAllForUser(updatedUser.getId(), TokenScope.ACTIVATION.getScope());

        return updatedUser;
    }

    public void requestResetPassword(String email) throws MessagingException {
        Optional<User> optionalUser = userService.findByEmail(email);
        if (optionalUser.isEmpty()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("email", "email does not exist");
            throw new InvalidException(errorDetails);
        }

        User user = optionalUser.get();
        if (!user.isEnabled()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("email", "user account must be activated");
            throw new InvalidException(errorDetails);
        }

        var token = tokenService.newToken(
                user.getId(),
                Duration.ofMinutes(45),
                TokenScope.PASSWORD_RESET.getScope()
        );
        
        Email passwordResetEmail = emailService.createEmail(user.getEmail(), user.getNickname(), token, EmailSubject.PASSWORD_RESET, EmailTemplateName.PASSWORD_RESET);
        emailService.sendEmail(passwordResetEmail);
    }

    private ErrorDetails validateAccountExistence(User user) {
        List<User> existedAccounts = userService.findExistedAccounts(
                user.getNickname(),
                user.getEmail(),
                user.getPhoneNumber()
        );

        int index = 0;
        var errorDetails = new ErrorDetails();
        while (index < existedAccounts.size()) {
            var account = existedAccounts.get(index);
            if (account.getNickname().equals(user.getNickname())) {
                errorDetails.addError("nickname", "nickname is unavailable");
            }

            if (account.getEmail().equals(user.getEmail())) {
                errorDetails.addError("email", "email is already registered");
            }

            if (account.getPhoneNumber().equals(user.getPhoneNumber())) {
                errorDetails.addError("phoneNumber", "phone number is already used by other accounts");
            }

            if (errorDetails.getErrors().containsKey("nickname") &&
                errorDetails.getErrors().containsKey("email") &&
                errorDetails.getErrors().containsKey("phoneNumber")
            ) {
                break;
            }

            index += 1;
        }

        return errorDetails;
    }


}
