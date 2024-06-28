package com.amess.messbook.social;

import com.amess.messbook.social.entity.RelationshipId;
import com.amess.messbook.social.entity.UserRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRelationshipRepository extends JpaRepository<UserRelationship, RelationshipId> {

    // Used for finding a relationship regardless of who are the sender and receiver
    @Query(value = """
            SELECT
            	*
            FROM
            	USER_RELATIONSHIP AS U_R
            WHERE
            	SENDER_ID = :firstUserId
            	AND RECEIVER_ID = :secondUserId
            	OR SENDER_ID = :secondUserId
            	AND RECEIVER_ID = :firstUserId
            """, nativeQuery = true)
    Optional<UserRelationship> findByUnorderedId(UUID firstUserId, UUID secondUserId);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM USER_RELATIONSHIP
            WHERE
            	SENDER_ID = :userId
            	AND RECEIVER_ID = :friendId
            	OR SENDER_ID = :friendId
            	AND RECEIVER_ID = :userId
            """, nativeQuery = true)
    void deleteByUnorderedId(UUID userId, UUID friendId);
}
