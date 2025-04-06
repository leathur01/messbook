package com.amess.messbook.util.error;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import org.springframework.stereotype.Service;

@Service
public class ExceptionThrower {

    public void throwInvalidException(String field, String errorMessage) {
        var errorDetails = new ErrorDetails();
        errorDetails.addError(field, errorMessage);
        throw new InvalidException(errorDetails);
    }
}
