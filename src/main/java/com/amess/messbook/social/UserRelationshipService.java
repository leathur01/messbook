package com.amess.messbook.social;

import com.amess.messbook.aop.exceptionhHandler.exception.ErrorDetails;
import com.amess.messbook.aop.exceptionhHandler.exception.InvalidException;
import com.amess.messbook.social.dto.FriendRequestData;
import com.amess.messbook.social.entity.RelationshipId;
import com.amess.messbook.social.entity.User;
import com.amess.messbook.social.entity.UserRelationship;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserRelationshipService {

    private final UserRelationshipRepository userRelationshipRepository;
    private final UserRepository userRepository;

    public void save(User sender, User receiver, String status) {
        var userRelationship = UserRelationship.builder()
                .id(new RelationshipId(sender.getId(), receiver.getId()))
                .sender(sender)
                .receiver(receiver)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRelationshipRepository.save(userRelationship);
    }

    public void addRelationship(User sender, FriendRequestData friendRequest, String status) {
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

        save(sender, receiver, status);
    }

    public void deleteById(UUID senderId, UUID receiverID) {
        var relationshipId = new RelationshipId(senderId, receiverID);
        userRelationshipRepository.deleteById(relationshipId);
    }
}
