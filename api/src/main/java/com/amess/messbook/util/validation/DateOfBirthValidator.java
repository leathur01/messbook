package com.amess.messbook.util.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class DateOfBirthValidator implements ConstraintValidator<DateOfBirthConstraint, LocalDate> {
    @Override
    public boolean isValid(LocalDate dateOfBirth, ConstraintValidatorContext constraintValidatorContext) {
        if (dateOfBirth == null) {
            return true;
        }

        return dateOfBirth.isBefore(LocalDate.now());
    }
}
