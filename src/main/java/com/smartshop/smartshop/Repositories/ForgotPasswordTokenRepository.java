package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, UUID> {
    Optional<ForgotPasswordToken> findByTokenHashAndUsedAtIsNullAndExpiresAtAfter(
            String tokenHash, LocalDateTime now
    );

    @Query("""
  SELECT p FROM ForgotPasswordToken p
  WHERE p.tokenHash = :hash AND p.usedAt IS NULL AND p.expiresAt > :now
""")
    Optional<ForgotPasswordToken> findValidByHash(@Param("hash") String hash, @Param("now") Instant now);

    @Query("""
        SELECT COUNT(t) FROM ForgotPasswordToken t
        WHERE t.usuario.id = :userId AND t.expiresAt > :after
    """)
    long countRecentByUser(String userId, LocalDateTime after);

}