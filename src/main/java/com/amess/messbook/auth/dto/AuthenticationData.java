package com.amess.messbook.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthenticationData {

    @NotNull
    @Email(message = "Please enter a valid email")
    private String email;

    @NotNull
    private String password;
}
