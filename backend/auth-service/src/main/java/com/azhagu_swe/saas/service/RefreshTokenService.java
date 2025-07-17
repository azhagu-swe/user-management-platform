package com.azhagu_swe.saas.service; // Your service package

import com.azhagu_swe.saas.model.entity.RefreshToken;
import com.azhagu_swe.saas.exception.InvalidTokenException; 
import com.azhagu_swe.saas.exception.ResourceNotFoundException; 

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenService {

    /**
     * Finds a refresh token entity by its token string.
     *
     * @param token The token string.
     * @return An Optional containing the RefreshToken if found.
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Creates a new refresh token for the given user.
     * This will typically invalidate/delete any existing refresh tokens for the
     * user
     * to ensure only one active refresh token per user (or per user/device
     * session).
     *
     * @param userId The ID of the user for whom to create the token.
     * @return The created and persisted RefreshToken entity.
     * @throws ResourceNotFoundException if the user with the given ID is not found.
     */
    RefreshToken createRefreshToken(UUID userId);

    /**
     * Verifies if the given refresh token is valid (not expired and not already
     * used/revoked).
     * If the token is expired, it should be deleted.
     *
     * @param token The RefreshToken entity to verify.
     * @return The same RefreshToken entity if valid.
     * @throws InvalidTokenException if the token is expired, already used, or
     *                               otherwise invalid.
     */
    RefreshToken verifyTokenAndHandleExpiration(RefreshToken token);

    /**
     * Deletes a specific refresh token entity.
     * Useful when a token is used for rotation and needs to be removed.
     *
     * @param token The RefreshToken entity to delete.
     */
    void deleteSpecificToken(RefreshToken token);

    /**
     * Deletes all refresh tokens associated with a specific user ID.
     * Useful for "logout from all devices" functionality or when a user's password
     * changes.
     *
     * @param userId The ID of the user whose refresh tokens are to be deleted.
     * @return The number of tokens deleted.
     */
    int deleteAllTokensByUserId(UUID userId);
    
}