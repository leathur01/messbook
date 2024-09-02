package com.amess.messbook.security;

import com.amess.messbook.aop.exceptionhHandler.exception.InvalidAuthenticationTokenException;
import com.amess.messbook.auth.JwtService;
import com.amess.messbook.social.UserRepository;
import com.amess.messbook.social.UserService;
import com.amess.messbook.social.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Users have to authenticated to log out (revoke their jwt authentication token)
        // This will prevent malicious users to revoke a stolen token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        String encodedJwt = authHeader.substring(7);
        Jws<Claims> jwt = jwtService.readJwt(encodedJwt);
        boolean isValid = jwtService.isValid(encodedJwt);
        if (!isValid) {
            throw new InvalidAuthenticationTokenException();
        }

        // Handle the user fetching here instead of abstract it in to the isValid method
        // because if so, I have to find the user 2 times
        String UuidString = jwt.getPayload().getSubject();
        UUID userId = UUID.fromString(UuidString);
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) {
            // Handle the case where a valid jwt token with deleted account's id claim is used
            throw new InvalidAuthenticationTokenException();
        }

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        var authentication = new UsernamePasswordAuthenticationToken(
                user.get(),
                null,
                user.get().getAuthorities()
        );

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        filterChain.doFilter(request, response);
    }
}
