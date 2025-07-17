package com.azhagu_swe.saas.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens", indexes = {
        @Index(name = "idx_refresh_token_token", columnList = "token", unique = true),
        @Index(name = "idx_refresh_token_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true, exclude = { "user" }) // Added callSuper = true, user is already excluded
@EqualsAndHashCode(of = { "id" }, callSuper = false) // Added for proper entity equality based on ID
public class RefreshToken extends AbstractAuditableEntity { // Assuming AbstractAuditableEntity exists

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    // @ToString.Exclude is already handled by the class-level @ToString(exclude =
    // {"user"})
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    // Constructors
    public RefreshToken(User user, String token, Instant expiryDate) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    /**
     * Helper method to check if the token has expired.
     * 
     * @return true if the token has expired, false otherwise.
     */
    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }
}