package com.azhagu_swe.saas.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = { "id", "username", "email" }, callSuper = false)
public class User extends AbstractAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password; // toString excludes this

    @Column(length = 20)
    private String phoneNumber;

    @Column(name = "profile_image_path", length = 255)
    private String profileImagePath;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @ToString.Exclude // Exclude from default toString to avoid recursion or large output if roles are
                      // complex
    private Set<Role> roles = new HashSet<>();

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    // Custom constructor if @AllArgsConstructor is too broad or specific logic is
    // needed
    public User(String firstName, String lastName, String username, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password; // Hashing should be done in the service layer before saving
    }

    // For a more controlled toString, especially with collections:
    public String getRolesAsString() {
        if (this.roles == null || this.roles.isEmpty()) {
            return "[]";
        }
        return this.roles.stream().map(Role::getName).collect(Collectors.joining(", ", "[", "]"));
    }

    // Example of how Lombok's @ToString can be customized manually if needed,
    // but the annotation is usually sufficient with 'exclude'.
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", profileImagePath='" + profileImagePath + '\'' +
                ", roles=" + getRolesAsString() + // Use custom method for roles
                ", isVerified=" + isVerified +
                ", createdAt=" + getCreatedAt() +
                ", updatedAt=" + getUpdatedAt() +
                ", createdBy='" + getCreatedBy() + '\'' +
                ", updatedBy='" + getUpdatedBy() + '\'' +
                '}';
    }
}