package com.amess.messbook.auth;

import com.amess.messbook.auth.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {

    @Transactional
    @Modifying
    @Query(value = "DELETE\n" +
            "FROM \"token\" AS tk\n" +
            "WHERE tk.user_id = :userId\n" +
            "AND tk.scope = :scope", nativeQuery = true)
    void deleteAllForUser(UUID userId, String scope);
}
