package com.amess.messbook.security;

import com.amess.messbook.aop.exceptionhHandler.GlobalExceptionHandler;
import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidAuthenticationTokenException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            filterChain.doFilter(request, response);
        } catch (MalformedJwtException |InvalidAuthenticationTokenException | ExpiredJwtException | SignatureException ex) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("error", "invalid or expired activation token");
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            errorResponse(request, response, errorDetails);

        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);

            var errorDetails = new ErrorDetails();
            errorDetails.addError("error", "server is having some problems");
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            errorResponse(request, response, errorDetails);
        }
    }

    private void errorResponse(
            HttpServletRequest request,
            HttpServletResponse response,
            ErrorDetails errorDetails
    ) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(errorDetails);

        response.getWriter().write(jsonResponse);
    }
}
