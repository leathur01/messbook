package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.social.dto.FriendRequestData;
import com.amess.messbook.social.entity.RelationshipId;
import com.amess.messbook.social.entity.User;
import com.amess.messbook.social.entity.UserRelationship;
import lombok.RequiredArgsConstructor;
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

    void addFriend(User sender, FriendRequestData friendRequest) throws NoResourceFoundException {
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
        Optional<UserRelationship> existedRequest = userRelationshipRepository.findById(new RelationshipId(receiver.getId(), sender.getId()));
        if (existedRequest.isPresent()) {
            var userRelationship = existedRequest.get();
            acceptRequest(userRelationship);
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
    }

    void removeRelationship(UUID senderId, UUID receiverID) {
        var relationshipId = new RelationshipId(senderId, receiverID);
        userRelationshipRepository.deleteById(relationshipId);
    }

    void processRequestAcceptance(User receiver, UUID senderId) throws NoResourceFoundException {
        var optionalUserRelationship = userRelationshipRepository.findById(new RelationshipId(senderId, receiver.getId()));

        if (optionalUserRelationship.isEmpty()) {
            throw new NoResourceFoundException(null, null);
        }
        var userRelationship = optionalUserRelationship.get();

        acceptRequest(userRelationship);
    }

    private void acceptRequest(UserRelationship userRelationship) {
        userRelationship.setStatus("ACCEPTED");
        userRelationship.setUpdatedAt(LocalDateTime.now());
        userRelationshipRepository.save(userRelationship);

    }

    List <User> getFriendRequests(UUID userId, String direction) {
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
