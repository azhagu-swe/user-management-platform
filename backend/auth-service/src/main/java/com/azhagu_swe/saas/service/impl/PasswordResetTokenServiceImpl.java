package com.azhagu_swe.saas.service.impl;
import com.azhagu_swe.saas.model.entity.PasswordResetToken;
import com.azhagu_swe.saas.model.entity.User;
import com.azhagu_swe.saas.model.repository.PasswordResetTokenRepository;
import com.azhagu_swe.saas.service.PasswordResetTokenService;
import com.azhagu_swe.saas.exception.InvalidTokenException; // Your custom exception
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {
    private final PasswordResetTokenRepository tokenRepository;

    @Value("${saas.app.passwordResetToken.expirationHours:24}") // Configurable expiration
    private long expirationHours;

    public PasswordResetTokenServiceImpl(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    @Transactional
    public PasswordResetToken createPasswordResetTokenForUser(User user) {
        // Invalidate previous tokens for the same user (optional, but good practice)
        tokenRepository.findByUserAndUsedIsFalseAndExpiryDateAfter(user, Instant.now())
            .forEach(existingToken -> {
                existingToken.setUsed(true); // Mark old ones as used or delete them
                tokenRepository.save(existingToken);
            });

        String tokenString = UUID.randomUUID().toString(); // Generate a secure random token
        Instant expiryDate = Instant.now().plus(expirationHours, ChronoUnit.HOURS);
        PasswordResetToken passwordResetToken = new PasswordResetToken(user, tokenString, expiryDate);
        return tokenRepository.save(passwordResetToken);
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    @Override
    public PasswordResetToken verifyToken(String tokenString) {
        PasswordResetToken token = findByToken(tokenString)
            .orElseThrow(() -> new InvalidTokenException("Invalid or non-existent password reset token."));
        
        if (token.isUsed()) {
            throw new InvalidTokenException("This password reset token has already been used.");
        }
        if (token.isExpired()) {
            throw new InvalidTokenException("Password reset token has expired.");
        }
        return token;
    }

    @Override
    @Transactional
    public void markTokenAsUsed(PasswordResetToken token) {
        token.setUsed(true);
        tokenRepository.save(token);
    }
    
    @Override
    @Transactional
    // @Scheduled(cron = "0 0 3 * * ?") // Example: Run daily at 3 AM for cleanup
    public void deleteExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}