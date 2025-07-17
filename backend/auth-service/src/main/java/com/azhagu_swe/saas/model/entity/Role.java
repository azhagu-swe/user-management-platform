package com.azhagu_swe.saas.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role extends AbstractAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
    @ToString.Exclude
    private Set<Permission> permissions = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }

    // Helper methods for managing bidirectional relationships or collections are
    // still good practice
    public void addPermission(Permission permission) {
        this.permissions.add(permission);
        // If Permission had a back-reference to Role:
        // permission.getRoles().add(this);
    }

    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
        // If Permission had a back-reference to Role:
        // permission.getRoles().remove(this);
    }

    public String getPermissionsAsString() {
        if (this.permissions == null || this.permissions.isEmpty()) {
            return "[]";
        }
        return this.permissions.stream().map(Permission::getName).collect(Collectors.joining(", ", "[", "]"));
    }
}