package com.azhagu_swe.saas.service.impl;

import com.azhagu_swe.saas.exception.InvalidTokenException;
import com.azhagu_swe.saas.exception.ResourceNotFoundException;
import com.azhagu_swe.saas.model.entity.RefreshToken;
import com.azhagu_swe.saas.model.entity.User;
import com.azhagu_swe.saas.model.repository.RefreshTokenRepository;
import com.azhagu_swe.saas.model.repository.UserRepository;
import com.azhagu_swe.saas.service.RefreshTokenService; // Import the interface
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenServiceImpl.class);

    @Value("${saas.app.refreshExpirationMs:2592000000}") // Default to 30 days (2592000000 ms)
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom(); // Reusable SecureRandom

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("Attempted to create refresh token for non-existent user ID: {}", userId);
                    return new ResourceNotFoundException("User", "id", userId.toString());
                });

        // Strategy: Invalidate/delete all existing refresh tokens for this user first.
        // This ensures only one active refresh token per user.
        int deletedCount = deleteAllTokensByUserId(userId);
        if (deletedCount > 0) {
            logger.info("Deleted {} existing refresh token(s) for user ID: {}", deletedCount, userId);
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        // Generate a secure random token string
        byte[] tokenBytes = new byte[32]; // 256-bit random token
        secureRandom.nextBytes(tokenBytes);
        String tokenString = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        refreshToken.setToken(tokenString);
        // Assuming 'used' flag defaults to false in RefreshToken entity or is set here
        // if needed.

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {}", user.getUsername());
        return savedToken;
    }

    @Override
    @Transactional // Make it transactional as it might delete the token
    public RefreshToken verifyTokenAndHandleExpiration(RefreshToken token) {
        if (token.isExpired()) { // Assuming RefreshToken entity has isExpired() or direct check
            logger.warn("Refresh token ID {} has expired. Deleting it.", token.getId());
            refreshTokenRepository.delete(token); // Delete expired token
            throw new InvalidTokenException("Refresh token has expired. Please sign in again.");
        }
        // Add other checks if needed, e.g., if (token.isUsed()) for stricter one-time
        // use,
        // though our current createRefreshToken strategy (delete all previous) might
        // cover this.
        return token;
    }

    @Override
    @Transactional
    public void deleteSpecificToken(RefreshToken token) {
        if (token != null) {
            refreshTokenRepository.delete(token);
            logger.info("Deleted specific refresh token ID: {} for user: {}", token.getId(),
                    token.getUser().getUsername());
        }
    }

    @Override
    @Transactional
    public int deleteAllTokensByUserId(UUID userId) {
        logger.info("Attempting to delete all refresh tokens for user ID: {}", userId);
        return refreshTokenRepository.deleteByUserId(userId); // Assumes this method exists in RefreshTokenRepository
    }

}