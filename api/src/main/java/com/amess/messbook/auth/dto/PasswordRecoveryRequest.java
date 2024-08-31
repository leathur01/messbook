package com.amess.messbook.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//The default constructor is required by the jackson library for this class but not the other classes for some reason
public class PasswordRecoveryRequest {
    @NotNull
    @Email(message = "Please enter a valid email")
    private String email;
}
