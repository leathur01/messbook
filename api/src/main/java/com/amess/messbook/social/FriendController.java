package com.amess.messbook.social;

import com.amess.messbook.social.dto.UserDTO;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class FriendController {

    private final FriendService friendService;
    private final ModelMapper modelMapper;
    private final UserRelationshipRepository userRelationshipRepository;

    @GetMapping("users/self/friends")
    public List<UserDTO> viewCurrentFriends(@AuthenticationPrincipal User user) {
        return friendService.getFriends(user.getId()).stream()
                .map(u -> modelMapper.map(u, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("users/{userId}/friends")
    public List<UserDTO> viewFriendsOf(@PathVariable UUID userId) {
        return friendService.getFriends(userId).stream()
                .map(u -> modelMapper.map(u, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("users/self/friends/{friendId}/mutual")
    public List<UserDTO> viewMutualFriends(
            @PathVariable UUID friendId,
            @AuthenticationPrincipal User user
    ) {
        return friendService.getMutualFriendsForTwoUsers(user.getId(), friendId).stream()
                .map(u -> modelMapper.map(u, UserDTO.class))
                .collect(Collectors.toList());
    }

    @DeleteMapping("users/self/friends/{friendId}")
    public void unfriend(
            @PathVariable UUID friendId,
            @AuthenticationPrincipal User user
    ) {
        friendService.unfriend(user.getId(), friendId);
    }
}
