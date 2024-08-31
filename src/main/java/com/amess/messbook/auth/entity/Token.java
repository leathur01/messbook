package com.amess.messbook.auth.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.domain.Persistable;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Token implements Persistable<byte[]> {

    @Id
    private byte[] hash;

    @Transient
    @JsonProperty("token")
    @NotNull(message = "token must be provided")
    private String plainText;

    private LocalDateTime expiry;

    private String scope;

    private UUID userId;

    // Used for JSON parsing when only plaintext is available from the request
    public Token(String token) {
        this.plainText = token;
        this.hash = null;
        this.expiry = null;
        this.scope = null;
        this.userId = null;
    }

    @Override
    public byte[] getId() {
        return hash;
    }

//    Always return true so that we could use a custom ID generation
//    instead of the ID or UUID generation of the database
    @Override
    public boolean isNew() {
        return true;
    }
}
