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
public class UserRelationshipService {

    private final UserRelationshipRepository userRelationshipRepository;
    private final UserRepository userRepository;

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

//        We add ar new record into the intermediate table directly instead of adding the UserRelationship to the User and let Hibernate save to the db
//        Because we can't use the authenticated user fetched in the filter to add the new UserRelationship since the session has closed at the time we go to the controller layer
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

    void removeRequest(UUID senderId, UUID receiverID) {
        var relationshipId = new RelationshipId(senderId, receiverID);
        userRelationshipRepository.deleteById(relationshipId);
    }

    void acceptRequest(User receiver, UUID senderId) throws NoResourceFoundException {
        var optionalUserRelationship = userRelationshipRepository.findById(new RelationshipId(senderId, receiver.getId()));

        if (optionalUserRelationship.isEmpty()) {
            throw new NoResourceFoundException(null, null);
        }
        var userRelationship = optionalUserRelationship.get();

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
}
