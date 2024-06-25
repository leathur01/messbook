package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.auth.TokenService;
import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.auth.entity.TokenScope;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

        return user;
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
            errorDetails.addError("error", "password does not match");
            throw new InvalidException(errorDetails);
        }

        return user;
    }


}