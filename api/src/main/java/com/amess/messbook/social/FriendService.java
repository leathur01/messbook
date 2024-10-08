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
    private final UserService userService;

    void addFriend(User sender, FriendRequestData friendRequest) {
        if (sender.getNickname().equals(friendRequest.getNickname())) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("nickname", "Hm, didn't work. Double check that the username is correct.");
            throw new InvalidException(errorDetails);
        }

        Optional<User> optionalUser = userRepository.findByNickname(friendRequest.getNickname());
        if (optionalUser.isEmpty()) {
            var errorDetails = new ErrorDetails();
            errorDetails.addError("nickname", "Hm, didn't work. Double check that the username is correct.");
            throw new InvalidException(errorDetails);
        }
        User receiver = optionalUser.get();

        // If the other user already sent a friend request to this user
        // Then we simply accept it instead of sending another friend request
        Optional<UserRelationship> optionalUserRelationship = userRelationshipRepository.findByUnorderedId(receiver.getId(), sender.getId());
        if (optionalUserRelationship.isPresent()) {
            var existedRelationship = optionalUserRelationship.get();

            if (isRequestAlreadySentBy(receiver, existedRelationship) && existedRelationship.getStatus().equals("PENDING")) {
                acceptRequest(existedRelationship);
            } else if (existedRelationship.getStatus().equals("ACCEPTED")) {
                var errorDetails = new ErrorDetails();
                errorDetails.addError("nickname", "You're already friends with that user");
                throw new InvalidException(errorDetails);
            }
            // If the request has been sent before, then return
            return;
        }

        // We add ar new record into the intermediate table directly instead of adding the UserRelationship to the User and let Hibernate save to the db
        // Because we can't use the authenticated user fetched in the filter to add the new UserRelationship since the session has closed at the time we go to the controller layer
        var userRelationship = UserRelationship.builder()
                .id(new RelationshipId(sender.getId(), receiver.getId()))
                .sender(sender)
                .receiver(receiver)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRelationshipRepository.save(userRelationship);
        notificationService.sendMultipleDevicesNotification(
                receiver,
                "New friend request",
                "From " + sender.getNickname(),
                "SEND_FRIEND_REQUEST"
        );
    }

    private boolean isRequestAlreadySentBy(User user, UserRelationship existedRelationship) {
        return existedRelationship.getId().getSenderId().equals(user.getId());
    }

    void removeFriendRequest(UUID senderId, UUID receiverID) {
        var relationshipId = new RelationshipId(senderId, receiverID);
        userRelationshipRepository.deleteById(relationshipId);
    }

    void unfriend(UUID userId, UUID friendId) {
        userRelationshipRepository.deleteByUnorderedId(userId, friendId);
    }

    void processRequestAcceptance(User receiver, UUID senderId) throws NoResourceFoundException {
        var optionalUserRelationship = userRelationshipRepository.findById(new RelationshipId(senderId, receiver.getId()));

        if (optionalUserRelationship.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }
        var userRelationship = optionalUserRelationship.get();

        acceptRequest(userRelationship);
        // Does not need to check the validity of the senderId since it has been validated by the above code
        // But check anyway for safety net
        var optionalUser = userService.findById(senderId);
        if (optionalUser.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }
        notificationService.sendMultipleDevicesNotification(
                optionalUser.get(),
                "Friend request accepted",
                receiver.getNickname() + " accepted your friend request",
                "ACCEPT_FRIEND_REQUEST"
        );
    }

    private void acceptRequest(UserRelationship userRelationship) {
        userRelationship.setStatus("ACCEPTED");
        userRelationship.setUpdatedAt(LocalDateTime.now());
        userRelationshipRepository.save(userRelationship);

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
