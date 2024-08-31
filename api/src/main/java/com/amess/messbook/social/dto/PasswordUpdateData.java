package com.amess.messbook.social.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PasswordUpdateData {

    @NotNull
    private String currentPassword;

    @NotNull
    @Size(min = 12, max = 128, message="Password must be at least 8 and no more than 128 characters")
    private String newPassword;
}
