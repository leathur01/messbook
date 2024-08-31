package com.amess.messbook.auth.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.domain.Persistable;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class RevokedToken implements Persistable<String> {

    @Id
    String hexJwt;

    private LocalDateTime revokedAt;

    @Override
    public String getId() {
        return hexJwt;
    }

    // Always return true so that we could use a custom ID generation
    // instead of the ID or UUID generation of the database
    @Override
    public boolean isNew() {
        return true;
    }
}
