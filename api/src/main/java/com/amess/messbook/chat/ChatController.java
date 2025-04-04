package com.amess.messbook.chat;

import com.amess.messbook.chat.entity.Message;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/message")
    public Message sendMessage(@Payload Message chatMessage) {
        return chatService.sendMessage(chatMessage);
    }

    @GetMapping("messages/{receiverNickname}")
    public Page<Message> getChatMessages(@AuthenticationPrincipal User user, @PathVariable String receiverNickname, @RequestParam(defaultValue = "5") int page) {
        return chatService.getChatMessages(user, receiverNickname, page);
    }
}
