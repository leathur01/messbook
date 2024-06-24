package com.amess.messbook.aop.exceptionhHandler.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvalidException extends RuntimeException{

    private ErrorDetails errorDetails;
}
