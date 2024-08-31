package com.amess.messbook.social.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserDTO {
    private String nickname;

    private String email;

    private String bio;

    private Boolean activated;

    private String phoneNumber;

    private LocalDate dateOfBirth;
}
