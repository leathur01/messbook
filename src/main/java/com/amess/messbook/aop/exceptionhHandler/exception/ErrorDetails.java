package com.amess.messbook.aop.exceptionhHandler.exception;

import lombok.*;

import java.util.HashMap;
import java.util.Map;

@ToString
@Getter
@Setter
@NoArgsConstructor
@Builder
public class ErrorDetails {
    private Map<String, String> errors = new HashMap<>();

    public ErrorDetails(Map<String, String> errorMessages) {
        this.errors = errorMessages;
    }

    public ErrorDetails(String errorMessage) {
        this.errors.put("error", errorMessage);
    }

    public void addError(String field, String message) {
        this.errors.put(field, message);
    }
}
