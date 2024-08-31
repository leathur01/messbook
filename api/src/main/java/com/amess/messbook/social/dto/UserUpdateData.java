package com.amess.messbook.social.dto;

import com.amess.messbook.util.validation.DateOfBirthConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateData {

    // See free form data validation
    private String bio;

    @DateOfBirthConstraint
    private LocalDate dateOfBirth;
}
