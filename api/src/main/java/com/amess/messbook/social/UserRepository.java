package com.amess.messbook.social;

import com.amess.messbook.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = "SELECT *\n" +
            "FROM \"user\" as u\n" +
            "INNER JOIN \"token\" as tk\n" +
            "ON u.id = tk.user_id\n" +
            "WHERE tk.hash = :hash\n" +
            "AND tk.scope = :scope\n" +
            "AND tk.expiry > :currentTime\n", nativeQuery = true)
    Optional<User> getForToken(byte[] hash, String scope, LocalDateTime currentTime);

    @Query(value = "SELECT *\n" +
            "FROM \"user\"\n" +
            "WHERE nickname = :nickname\n" +
            "OR email = :email\n" +
            "OR phone_number = :phoneNumber", nativeQuery = true)
    List<User> findExistedAccounts(String nickname, String email, String phoneNumber);

    @Query(value = "SELECT sender.*\n" +
            "FROM \"user\" as sender\n" +
            "JOIN user_relationship ON user_relationship.sender_id = sender.id\n" +
            "JOIN \"user\" as receiver ON user_relationship.receiver_id = receiver.id\n" +
            "WHERE user_relationship.status = 'PENDING'\n" +
            "AND user_relationship.receiver_id = :userId\n", nativeQuery = true)
    List<User> getReceivedFriendRequestsForUser(UUID userId);

    @Query(value = "SELECT receiver.*\n" +
            "FROM \"user\" as sender\n" +
            "JOIN user_relationship ON user_relationship.sender_id = sender.id\n" +
            "JOIN \"user\" as receiver ON user_relationship.receiver_id = receiver.id\n" +
            "WHERE user_relationship.status = 'PENDING'\n" +
            "AND user_relationship.sender_id = :userId\n", nativeQuery = true)
    List<User> getSentFriendRequestForUser(UUID userId);

    @Query(value = "SELECT\n" +
            "RECEIVER.*\n" +
            "FROM\n" +
            "\"user\" AS SENDER\n" +
            "JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID\n" +
            "JOIN \"user\" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID\n" +
            "WHERE\n" +
            "U_R.STATUS = 'ACCEPTED'\n" +
            "AND SENDER.ID = :userId\n" +
            "UNION\n" +
            "SELECT\n" +
            "SENDER.*\n" +
            "FROM\n" +
            "\"user\" AS SENDER\n" +
            "JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID\n" +
            "JOIN \"user\" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID\n" +
            "WHERE\n" +
            "U_R.STATUS = 'ACCEPTED'\n" +
            "AND RECEIVER.ID = :userId", nativeQuery = true)
    List<User> getFriendForUser(UUID userId);

    @Query(value = """
            (SELECT RECEIVER.*
            FROM "user" AS SENDER
            JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID
            JOIN "user" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID
            WHERE U_R.STATUS = 'ACCEPTED' AND SENDER.ID = :firstUserId
            UNION
            SELECT SENDER.*
            FROM "user" AS SENDER
            JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID
            JOIN "user" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID
            WHERE U_R.STATUS = 'ACCEPTED' AND RECEIVER.ID = :firstUserId)
            
            INTERSECT
            
            (SELECT RECEIVER.*
            FROM "user" AS SENDER
            JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID
            JOIN "user" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID
            WHERE U_R.STATUS = 'ACCEPTED' AND SENDER.ID = :secondUserId
            UNION
            SELECT SENDER.*
            FROM "user" AS SENDER
            JOIN USER_RELATIONSHIP AS U_R ON U_R.SENDER_ID = SENDER.ID
            JOIN "user" AS RECEIVER ON U_R.RECEIVER_ID = RECEIVER.ID
            WHERE U_R.STATUS = 'ACCEPTED' AND RECEIVER.ID = :secondUserId)
            """, nativeQuery = true)
    List<User> getMutualFriendsForTwoUsers(UUID firstUserId, UUID secondUserId);

}
