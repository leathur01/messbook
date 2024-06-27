package com.amess.messbook.social;

import com.amess.messbook.social.dto.FriendRequestData;
import com.amess.messbook.social.dto.UserDTO;
import com.amess.messbook.social.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class FriendRequestController {

    private final FriendService friendService;
    private final ModelMapper modelMapper;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("users/self/friends/requests")
    public void sendFriendRequest(
            @RequestBody @Valid FriendRequestData friendRequest,
            @AuthenticationPrincipal User sender
    ) throws NoResourceFoundException {
        friendService.addFriend(sender, friendRequest);
    }

    @GetMapping("users/self/friends/requests")
    public List<UserDTO> viewFriendRequests(
            @RequestParam(value = "direction", required = false, defaultValue = "incoming") String direction,
            @AuthenticationPrincipal User user
    ) {
        return friendService.getFriendRequests(user.getId(), direction).stream()
                .map(u -> modelMapper.map(u, UserDTO.class))
                .collect(Collectors.toList());
    }

    @PutMapping("users/self/friends/{senderId}/requests/accept")
    public HashMap<String, String> acceptFriendRequest(
            @PathVariable UUID senderId,
            @AuthenticationPrincipal User receiver
    ) throws NoResourceFoundException {
        friendService.processRequestAcceptance(receiver, senderId);
        var response = new HashMap<String, String>();
        response.put("message", "You have accepted a friend request from user " + senderId.toString());

        return response;
    }

    // Use Put method for denying and canceling instead of Delete method because this would expose our implementation where we delete a record in the user_relationship table
    // Use Put method for both endpoint would be more user-friendly
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("users/self/friends/{senderId}/requests/deny")
    public void denyFriendRequest(
            @PathVariable UUID senderId,
            @AuthenticationPrincipal User receiver
    ) {
        friendService.removeRequest(senderId, receiver.getId());
    }

    // Use the unique username requires complex handling when the username changes
    // So we use the user's id for ease of development
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("users/self/friends/{receiverId}/requests/cancel")
    public void cancleFriendRequest(
            @PathVariable UUID receiverId,
            @AuthenticationPrincipal User sender
    ) {
        friendService.removeRequest(sender.getId(), receiverId);
    }
}
