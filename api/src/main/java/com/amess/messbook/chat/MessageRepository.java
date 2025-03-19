package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByChatIdOrderByIdAsc(UUID chatId);
}
