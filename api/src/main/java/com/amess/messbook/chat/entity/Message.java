package com.amess.messbook.chat.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Message {

    // Use incremental id to keep track of the message sequence
    // Can not use created_at because two message can be created at the same time
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String senderNickname;
    private String receiverNickname;
    private String content;
    private LocalDateTime createdAt;
    private UUID chatId;
}
