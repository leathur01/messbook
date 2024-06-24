package com.amess.messbook.aop.exceptionhHandler;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidAuthenticationTokenException;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.security.SignatureException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler({SignatureException.class, InvalidAuthenticationTokenException.class})
    public ErrorDetails handleInvalidAuthenticationToken() {
        var errorDetails = new ErrorDetails();
        errorDetails.addError("token", "invalid or expired activation token");
        return errorDetails;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorDetails handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errorFields = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errorFields.put(fieldName, errorMessage);

        });

        var errorDetails = new ErrorDetails(errorFields);
        return errorDetails;
    }

    // Return consistent errors for the two exceptions to avoid user enumeration attacks
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler({BadCredentialsException.class, DisabledException.class})
    public ErrorDetails handleBadCredentialsException() {
        var errorDetails = new ErrorDetails();
        errorDetails.addError("error", "email or password is invalid");
        return errorDetails;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidException.class)
    public ErrorDetails handleInvalidExceptions(InvalidException ex) {
        return ex.getErrorDetails();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ErrorDetails handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        var errorDetails = new ErrorDetails();
        errorDetails.addError("error", "bad request format");
        return errorDetails;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({HttpRequestMethodNotSupportedException.class, NoResourceFoundException.class})
    public ErrorDetails handleNoResourceFoundException() {
        var errorDetails = new ErrorDetails();
        errorDetails.addError("error", "resource not found");
        return errorDetails;
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ErrorDetails handleServerError(Exception ex) {
        var errorDetails = new ErrorDetails("server is having some problems");
        logger.error(ex.getMessage(), ex);
        return errorDetails;
    }
}
