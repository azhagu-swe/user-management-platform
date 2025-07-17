package com.azhagu_swe.saas.security.service.impl;


import com.azhagu_swe.saas.model.entity.User;       // Your User entity
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@EqualsAndHashCode(of = "id")
public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private UUID id;
    private String applicationUsername; // Actual username from User entity
    private String email;               // Used for login (as UserDetails.getUsername())

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    // Private constructor, use the static build method
    private UserDetailsImpl(UUID id, String applicationUsername, String email, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.applicationUsername = applicationUsername;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    /**
     * Static factory method to build UserDetailsImpl from a User entity.
     * Populates authorities with both ROLE_ prefixed role names and permission names.
     *
     * @param user The User entity from your database.
     * @return UserDetailsImpl instance.
     */
   public static UserDetailsImpl build(User user) {
        // What's happening here?
        // We're preparing a list of all "authorities" (think of them as permissions or rights)
        // that this specific 'user' has. This list will include their roles (like "ROLE_ADMIN")
        // AND their specific permissions (like "PERMISSION_CREATE_DOCUMENT").

        // Step 0: Initialize an empty container for authorities.
        // We use a 'Set' here to automatically prevent any duplicate authority strings.
        Set<GrantedAuthority> authoritiesSet = new HashSet<>();

        // --- Step 1: Add the User's Roles as Authorities ---
        // First, we look at the roles directly assigned to the user.
        if (user.getRoles() != null) { // Check if the user object actually has a list/set of roles.
                                       // If user.getRoles() is null, we skip this part.
            
            user.getRoles().forEach(role -> { // Loop through each 'Role' object the user has.
                
                // For each role, we get its name (e.g., "StandardUser", "AccountAdmin").
                // We must ensure the role name is not null or just empty spaces.
                if (role.getName() != null && !role.getName().trim().isEmpty()) {
                    
                    // This is a key part for roles:
                    // We create a 'SimpleGrantedAuthority' object.
                    // Spring Security often expects roles to be prefixed with "ROLE_".
                    // So, if a role name is "StandardUser", it becomes "ROLE_STANDARDUSER".
                    // .toUpperCase() makes it "ROLE_STANDARDUSER" (conventionally uppercase).
                    authoritiesSet.add(new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()));
                    // Example: If role.getName() is "Admin", we add "ROLE_ADMIN" to our set.
                }
            });
        }
        // At this point, 'authoritiesSet' contains things like:
        // "ROLE_STANDARDUSER", "ROLE_ACCOUNTADMIN" (if the user had these roles)

        // --- Step 2: Add the Permissions from those Roles as Authorities ---
        // Now, we go through the user's roles again, but this time we look inside each role
        // to find all the specific permissions it grants.
        if (user.getRoles() != null) { // Again, check if the user has roles.
            
            user.getRoles().stream() // Start a stream to process the roles.
                .filter(role -> role.getPermissions() != null) // Only consider roles that actually have a list/set of permissions.
                .flatMap(role -> role.getPermissions().stream()) // For each role, get its stream of Permission objects and merge them all into one big stream of Permission objects.
                .filter(permission -> permission.getName() != null && !permission.getName().trim().isEmpty()) // Make sure each Permission object has a valid name.
                .forEach(permission -> { // Loop through each valid Permission object.
                    
                    // For each permission, we create a 'SimpleGrantedAuthority' object
                    // using its name directly (e.g., "PERMISSION_WIDGET_CREATE").
                    authoritiesSet.add(new SimpleGrantedAuthority(permission.getName()));
                    // Example: If a permission.getName() is "PERMISSION_EDIT_PROFILE", we add that to our set.
                });
        }
        // Now, 'authoritiesSet' contains things like:
        // "ROLE_STANDARDUSER", "ROLE_ACCOUNTADMIN", 
        // "PERMISSION_WIDGET_CREATE", "PERMISSION_PROFILE_EDIT_SELF", etc.
        // (all combined from Step 1 and Step 2)

        // --- Step 3: Finalize the Authorities List ---
        // The constructor for UserDetailsImpl might expect a List, so we convert our Set to a List.
        // List.copyOf() creates an unmodifiable list, which is good practice here.
        List<GrantedAuthority> authoritiesList = List.copyOf(authoritiesSet);

        // --- Step 4: Create and Return the UserDetailsImpl Object ---
        // We now create the 'UserDetailsImpl' object that Spring Security will use.
        // We pass it all the necessary user information, including the combined 'authoritiesList'.
        return new UserDetailsImpl(
                user.getId(),                   // The user's unique ID (UUID)
                user.getUsername(),             // The application-specific username (e.g., "john_doe")
                user.getEmail(),                // The user's email (this will be used by Spring Security as the "username" for login)
                user.getPassword(),             // The user's hashed password
                authoritiesList);               // The complete list of all "powers" (roles + permissions) the user has.
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Returns the email address used to authenticate the user.
     * Spring Security will use this as the "username" during authentication.
     */
    @Override
    public String getUsername() {
        return email; // Login is by email
    }

    // The 'applicationUsername' field can be accessed via its getter if needed elsewhere.
    // public String getApplicationUsername() { return applicationUsername; }


    @Override
    public boolean isAccountNonExpired() {
        return true; // TODO: Implement actual logic based on User entity if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // TODO: Implement actual logic based on User entity if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // TODO: Implement actual logic based on User entity if needed
    }

    @Override
    public boolean isEnabled() {
        // Link this to user.isVerified() or a dedicated user.isEnabled field.
        return true; // TODO: Implement actual logic, potentially based on user.isVerified()
    }
}
