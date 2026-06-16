package com.buy.skyit.user.service;

import com.buy.skyit.common.constrains.UserRole;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public UserEntity getCurrentUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        String keycloakId = jwt.getSubject();

        return userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> createUser(jwt));
    }

    private UserEntity createUser(Jwt jwt) {

        UserEntity user = new UserEntity();

        user.setKeycloakId(jwt.getSubject());

        user.setEmail(jwt.getClaimAsString("email"));

        user.setUserName(jwt.getClaimAsString("preferred_username"));

        user.setLogin(jwt.getClaimAsString("preferred_username"));

        user.setRole(UserRole.USER);

        user.setIsActive(true);

        return userRepository.save(user);
    }

    public String getCurrentKeycloakId() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        return jwt.getSubject();
    }
}