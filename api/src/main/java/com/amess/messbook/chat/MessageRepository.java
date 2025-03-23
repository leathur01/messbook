package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    Page<Message> findByChatIdOrderByIdDesc(UUID chatId, Pageable pageable);
}
