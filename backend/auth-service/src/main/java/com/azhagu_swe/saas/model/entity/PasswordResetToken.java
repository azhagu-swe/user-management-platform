package com.azhagu_swe.saas.model.entity; // Assuming your entity package

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "password_reset_tokens", indexes = {
        @Index(name = "idx_pwd_reset_token_token", columnList = "token", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
public class PasswordResetToken extends AbstractAuditableEntity { // Or your own base entity

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100) // Ensure length is adequate for your token
    private String token;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER, optional = false)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Column(name = "is_used", nullable = false)
    private boolean used = false; // To mark token as used

    public PasswordResetToken(User user, String token, Instant expiryDate) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
        this.used = false;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }
}