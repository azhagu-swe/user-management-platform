package com.azhagu_swe.saas.security.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.azhagu_swe.saas.model.entity.User;
import com.azhagu_swe.saas.model.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@Service // Marks this class as a Spring service component
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads the user by their username (which, in our configuration, will be their
     * email).
     * This method is called by Spring Security during the authentication process.
     *
     * @param email The email address of the user trying to log in.
     * @return UserDetails object containing user information.
     * @throws UsernameNotFoundException if the user with the given email is not
     *                                   found.
     */
    @Override
    @Transactional                   
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find the user by email from the repository
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        return UserDetailsImpl.build(user);
    }
}