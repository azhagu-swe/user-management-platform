package com.azhagu_swe.saas.service;

import com.azhagu_swe.saas.model.entity.PasswordResetToken;
import com.azhagu_swe.saas.model.entity.User;
import java.util.Optional;

public interface PasswordResetTokenService {
    PasswordResetToken createPasswordResetTokenForUser(User user);

    Optional<PasswordResetToken> findByToken(String token);

    PasswordResetToken verifyToken(String token); // Validates existence, expiry, and not used

    void markTokenAsUsed(PasswordResetToken token);

    void deleteExpiredTokens(); // For cleanup
}