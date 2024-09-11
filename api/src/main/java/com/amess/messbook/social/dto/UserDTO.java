package com.amess.messbook.social.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserDTO {
    private UUID id;

    private String nickname;

    private String email;

    private String bio;

    private Boolean activated;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private LocalDateTime createdAt;
}
