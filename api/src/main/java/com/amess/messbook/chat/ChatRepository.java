package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {

    @Query(value = """
            SELECT *
            FROM CHAT
            WHERE
            SENDER_NICKNAME = :senderNickname
            AND RECEIVER_NICKNAME = :receiverNickname
            OR SENDER_NICKNAME = :receiverNickname
            AND RECEIVER_NICKNAME = :senderNickname
            """, nativeQuery = true)
    Optional<Chat> findBySenderNicknameAndReceiverNickname(String senderNickname, String receiverNickname);
}
