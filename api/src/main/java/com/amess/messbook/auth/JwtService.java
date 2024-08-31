package com.amess.messbook.auth;

import com.amess.messbook.auth.entity.RevokedToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class JwtService {

    private final RevokedTokenRepository revokedTokenRepository;

    @Value("${application.security.jwt.secrete-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    public String newAuthenticationToken(UUID userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .notBefore(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)))
                .compact();
    }

    public Jws<Claims> readJwt(String jwsString) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)))
                .build()
                .parseSignedClaims(jwsString);
    }

    public boolean isValid(String encodedJwt) {
        Jws<Claims> jwt = readJwt(encodedJwt);
        Date jwtNotBefore = jwt.getPayload().getNotBefore();
        Date jwtExpiration = jwt.getPayload().getExpiration();
        Date currentTime = new Date();

        return currentTime.after(jwtNotBefore)
                && currentTime.before(jwtExpiration)
                && !isRevoked(encodedJwt);
    }

    public void revokeJwt(String encodedJwt) {
        String hexJwt = DigestUtils.sha256Hex(encodedJwt);
        var revokedToken = RevokedToken.builder()
                .hexJwt(hexJwt)
                .revokedAt(LocalDateTime.now())
                .build();

        boolean isRevoked = isRevoked(revokedToken.getId());
        if (!isRevoked) {
            revokedTokenRepository.save(revokedToken);
        }
    }

    public boolean isRevoked(String encodedJwt) {
        String hexJwt = DigestUtils.sha256Hex(encodedJwt);
        return revokedTokenRepository.existsById(hexJwt);
    }
}
