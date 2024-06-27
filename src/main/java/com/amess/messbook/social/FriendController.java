package com.amess.messbook.social;

import com.amess.messbook.social.dto.UserDTO;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final UserRelationshipRepository userRelationshipRepository;
    private final ModelMapper modelMapper;

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
}
