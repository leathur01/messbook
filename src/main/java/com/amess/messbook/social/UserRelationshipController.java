package com.amess.messbook.social;

import com.amess.messbook.social.dto.FriendRequestData;
import com.amess.messbook.social.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@Transactional
public class UserRelationshipController {

    private final UserRelationshipService userRelationshipService;

    @PostMapping("users/self/friends")
    public HashMap<String, String> sendFriendRequest(
            @RequestBody @Valid FriendRequestData friendRequest,
            @AuthenticationPrincipal User sender
    ) {
        userRelationshipService.addRelationship(sender, friendRequest, "PENDING");
        var response = new HashMap<String, String>();
        response.put("message", "Your friend request has been sent");

        return response;
    }

//    Use the unique username requires complex handling when the username changes
//    So we use the user's id for ease of development
    @DeleteMapping("users/self/friends/{receiverId}")
    public HashMap<String, String> cancleFriendRequest(
            @PathVariable UUID receiverId,
            @AuthenticationPrincipal User sender
    ) throws NoResourceFoundException {
        userRelationshipService.deleteById(sender.getId(), receiverId);
        var response = new HashMap<String, String>();
        response.put("message", "Your friend request has been canceled");

        return response;
    }
}
