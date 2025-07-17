package com.azhagu_swe.saas.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.azhagu_swe.saas.model.entity.PasswordResetToken;
import com.azhagu_swe.saas.model.entity.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    // The method you're asking about:
    List<PasswordResetToken> findByUserAndUsedIsFalseAndExpiryDateAfter(User user, Instant currentDate);

    // For cleanup tasks (as suggested previously)
    void deleteByExpiryDateBefore(Instant now);
}
