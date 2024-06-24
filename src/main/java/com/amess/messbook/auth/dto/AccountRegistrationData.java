package com.amess.messbook.auth.dto;

import com.amess.messbook.util.validation.DateOfBirthConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
public class AccountRegistrationData {

    @NotNull
    // The  regex pattern follows the nickname policy of discord
    @Pattern(regexp = "^(?!.*(?:@|#|:|```))(?!everyone$)(?!here$)[\\w-]+$",
            message = "Invalid nickname format. nicknames cannot contain special characters such as '@', '#', ':', or triple backticks (`). Also, nicknames cannot be 'everyone' or 'here'")
    private String nickname;

    @NotNull
    @Email(message = "Please enter a valid email")
    private String email;

    @NotNull
    @Size(min = 12, max = 128,
            message="Password should be at least 8 and no more than 128 characters")
    private String password;

    @Pattern(regexp = "^(?:[0-9] ?){6,14}[0-9]$", message = "Please enter a valid phone number")
    private String phoneNumber;

    @NotNull
    @DateOfBirthConstraint
    private LocalDate dateOfBirth;
}
