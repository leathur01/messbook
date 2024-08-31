package com.amess.messbook.social.dto;

import com.amess.messbook.auth.entity.Token;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetData {

    @NotNull
    @Size(min = 12, max = 128,
            message="Password should be at least 8 and no more than 128 characters")
    private String password;

    @NotNull
    private Token token;
}
