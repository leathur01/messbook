package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Chat;
import com.amess.messbook.chat.entity.Message;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    @MessageMapping("/message")
    public Message sendMessage(@Payload Message chatMessage) {
        Optional<Chat> optionalChat = chatRepository.findBySenderNicknameAndReceiverNickname(chatMessage.getSenderNickname(), chatMessage.getReceiverNickname());
        Chat savedChatRoom;
        if (optionalChat.isEmpty()) {
            Chat chatRoom = Chat.builder()
                    .senderNickname(chatMessage.getSenderNickname())
                    .receiverNickname(chatMessage.getReceiverNickname())
                    .build();
            savedChatRoom = chatRepository.save(chatRoom);
        } else {
            savedChatRoom = optionalChat.get();
        }
        chatMessage.setChatId(savedChatRoom.getId());
        chatMessage.setCreatedAt(LocalDateTime.now());
        Message savedChatMessage = messageRepository.save(chatMessage);

        simpMessagingTemplate.convertAndSendToUser(savedChatMessage.getReceiverNickname(), "/messages", chatMessage);
        return savedChatMessage;
    }

    @GetMapping("messages/{receiverNickname}")
    public List<Message> getChatMessages(@AuthenticationPrincipal User user, @PathVariable String receiverNickname) {
        Optional<Chat> optionalChat = chatRepository.findBySenderNicknameAndReceiverNickname(user.getNickname(), receiverNickname);
        if (optionalChat.isEmpty()) {
            return List.of();
        }

        Chat chatRoom = optionalChat.get();
        List<Message> messages = messageRepository.findByChatIdOrderByIdAsc(chatRoom.getId());
        return messages;
    }
}
