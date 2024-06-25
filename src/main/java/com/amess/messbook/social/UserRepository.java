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

    @Query(
            value = "SELECT *\n" +
                    "FROM \"user\" as u\n" +
                    "INNER JOIN \"token\" as tk\n" +
                    "ON u.id = tk.user_id\n" +
                    "WHERE tk.hash = :hash\n" +
                    "AND tk.scope = :scope\n" +
                    "AND tk.expiry > :currentTime\n",
            nativeQuery = true
    )
    Optional<User> getForToken(byte[] hash, String scope, LocalDateTime currentTime);

    @Query(
            value = "SELECT *\n" +
                    "FROM \"user\"\n" +
                    "WHERE nickname = :nickname\n" +
                    "OR email = :email\n" +
                    "OR phone_number = :phoneNumber",
            nativeQuery = true
    )
    List<User> findExistedAccounts(String nickname, String email, String phoneNumber);

    @Query(
            value = "SELECT sender.*\n" +
                    "FROM \"user\" as sender\n" +
                    "JOIN user_relationship ON user_relationship.sender_id = sender.id\n" +
                    "JOIN \"user\" as receiver ON user_relationship.receiver_id = receiver.id\n" +
                    "WHERE user_relationship.status = 'PENDING'\n" +
                    "AND user_relationship.receiver_id = :userId\n",
            nativeQuery = true
    )
    List<User> getReceivedFriendRequestsForUser(UUID userId);

    @Query(
            value = "SELECT receiver.*\n" +
                    "FROM \"user\" as sender\n" +
                    "JOIN user_relationship ON user_relationship.sender_id = sender.id\n" +
                    "JOIN \"user\" as receiver ON user_relationship.receiver_id = receiver.id\n" +
                    "WHERE user_relationship.status = 'PENDING'\n" +
                    "AND user_relationship.sender_id = :userId\n",
            nativeQuery = true
    )
    List<User> getSentFriendRequestForUser(UUID userId);
}
