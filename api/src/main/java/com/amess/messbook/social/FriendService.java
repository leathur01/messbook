package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.notification.NotificationService;
import com.amess.messbook.social.dto.FriendRequestData;
import com.amess.messbook.social.entity.RelationshipId;
import com.amess.messbook.social.entity.User;
import com.amess.messbook.social.entity.UserRelationship;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class FriendService {

    private final UserRelationshipRepository userRelationshipRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    void addFriend(User sender, FriendRequestData friendRequest) {
        User receiver = getReceiver(sender, friendRequest);
        Optional<UserRelationship> optionalUserRelationship = userRelationshipRepository.findByUnorderedId(receiver.getId(), sender.getId());
        if (optionalUserRelationship.isPresent()) {
            UserRelationship existedFriendRequest = optionalUserRelationship.get();
            handleExistedFriendRequest(receiver, existedFriendRequest);
        } else {
            createFriendRequest(sender, receiver);
            notificationService.sendFriendRequestNotification(receiver, sender);
        }
    }

    private User getReceiver(User sender, FriendRequestData friendRequest) {
        if (isSendingFriendRequestToSelf(sender, friendRequest)) {
            var errorDetails = new ErrorDetails("nickname", "Hm, didn't work. Double check that the username is correct.");
            throw new InvalidException(errorDetails);
        }

        Optional<User> optionalUser = userRepository.findByNickname(friendRequest.getNickname());
        if (optionalUser.isEmpty()) {
            var errorDetails = new ErrorDetails("nickname", "Hm, didn't work. Double check that the username is correct.");
            throw new InvalidException(errorDetails);
        }
        return optionalUser.get();
    }

    private boolean isSendingFriendRequestToSelf(User sender, FriendRequestData friendRequest) {
        return sender.getNickname().equals(friendRequest.getNickname());
    }

    private void handleExistedFriendRequest(User receiver, UserRelationship friendRequest) {
        if (isRequestAlreadySentAndIsPendingBy(receiver, friendRequest)) {
            acceptRequest(friendRequest);
        } else if (friendRequest.getStatus().equals("ACCEPTED")) {
            var errorDetails = new ErrorDetails("nickname", "You're already friends with that user");
            throw new InvalidException(errorDetails);
        }
    }

    private boolean isRequestAlreadySentAndIsPendingBy(User user, UserRelationship existedRelationship) {
        return existedRelationship.getId().getSenderId().equals(user.getId()) && existedRelationship.getStatus().equals("PENDING");
    }

    private void createFriendRequest(User sender, User receiver) {
        UserRelationship userRelationship = UserRelationship.builder()
                .id(new RelationshipId(sender.getId(), receiver.getId()))
                .sender(sender)
                .receiver(receiver)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRelationshipRepository.save(userRelationship);
    }

    void removeFriendRequest(UUID senderId, UUID receiverID) {
        var relationshipId = new RelationshipId(senderId, receiverID);
        userRelationshipRepository.deleteById(relationshipId);
    }

    void unfriend(UUID userId, UUID friendId) {
        userRelationshipRepository.deleteByUnorderedId(userId, friendId);
    }

    void processRequestAcceptance(User receiver, UUID senderId) throws NoResourceFoundException {
        UserRelationship userRelationship = getUserRelationship(receiver, senderId);
        acceptRequest(userRelationship);
    }

    private UserRelationship getUserRelationship(User receiver, UUID senderId) throws NoResourceFoundException {
        var optionalUserRelationship = userRelationshipRepository.findById(new RelationshipId(senderId, receiver.getId()));
        if (optionalUserRelationship.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }
        return optionalUserRelationship.get();
    }

    private void acceptRequest(UserRelationship friendRequest) {
        friendRequest.setStatus("ACCEPTED");
        friendRequest.setUpdatedAt(LocalDateTime.now());
        userRelationshipRepository.save(friendRequest);

        User sender = friendRequest.getSender();
        User receiver = friendRequest.getReceiver();
        notificationService.sendRequestAcceptanceNotification(sender, receiver);
    }

    List<User> getFriendRequests(UUID userId, String direction) {
        if (direction.equals("outgoing")) {
            return userRepository.getSentFriendRequestForUser(userId);
        }

        return userRepository.getReceivedFriendRequestsForUser(userId);
    }

    List<User> getFriends(UUID userId) {
        return userRepository.getFriendForUser(userId);
    }

    List<User> getMutualFriendsForTwoUsers(UUID firstUserId, UUID secondUserId) {
        return userRepository.getMutualFriendsForTwoUsers(firstUserId, secondUserId);
    }
}
