package com.amess.messbook.auth;

import com.amess.messbook.auth.entity.Token;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public Token newToken(
            UUID userId,
            Duration ttl,
            String scope
    ) {

        var secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);

        var base32 = new Base32();
        String plainTextToken = base32.encodeToString(randomBytes).replaceAll("=", "");

        var token = Token.builder()
                .userId(userId)
                .expiry(LocalDateTime.now().plus(ttl))
                .scope(scope)
                .plainText(plainTextToken)
                .hash(DigestUtils.sha256(plainTextToken))
                .build();

        var savedToken = tokenRepository.save(token);
        return savedToken;
    }

    public void deleteAllForUser(UUID userId, String scope) {
        tokenRepository.deleteAllForUser(userId, scope);
    }
}
