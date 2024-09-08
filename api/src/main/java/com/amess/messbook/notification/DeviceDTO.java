package com.amess.messbook.notification;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceDTO {

    @NotNull
    private String deviceToken;

    @NotNull
    private UUID userId;
}
