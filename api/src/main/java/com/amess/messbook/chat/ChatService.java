package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Chat;
import com.amess.messbook.chat.entity.Message;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final int MESSAGES_SIZE = 15;

    Message sendMessage(Message chatMessage) {
        Message savedChatMessage = saveMessage(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(savedChatMessage.getReceiverNickname(), "/messages", chatMessage);
        return savedChatMessage;
    }

    Message saveMessage(Message chatMessage) {
        Chat savedChatRoom = getChatRoomAndCreateIfNotExist(chatMessage.getSenderNickname(), chatMessage.getReceiverNickname());
        chatMessage.setChatId(savedChatRoom.getId());
        chatMessage.setCreatedAt(LocalDateTime.now());
        return messageRepository.save(chatMessage);
    }

    Chat getChatRoomAndCreateIfNotExist(String senderNickname, String receiverNickname) {
        Optional<Chat> optionalChat = chatRepository.findBySenderNicknameAndReceiverNickname(senderNickname, receiverNickname);
        return optionalChat.orElseGet(() -> saveChatRoom(senderNickname, receiverNickname));
    }

    Chat saveChatRoom(String senderNickname, String receiverNickname) {
        Chat chatRoom = Chat.builder()
                .senderNickname(senderNickname)
                .receiverNickname(receiverNickname)
                .build();
        return chatRepository.save(chatRoom);
    }

    Page<Message> getChatMessages(User user, String receiverNickname, int page) {
        Optional<Chat> optionalChat = chatRepository.findBySenderNicknameAndReceiverNickname(user.getNickname(), receiverNickname);
        if (optionalChat.isEmpty()) {
            return Page.empty();
        }

        Chat chatRoom = optionalChat.get();
        Pageable pageable = PageRequest.of(page, MESSAGES_SIZE);
        return messageRepository.findByChatIdOrderByIdDesc(chatRoom.getId(), pageable);
    }

}
