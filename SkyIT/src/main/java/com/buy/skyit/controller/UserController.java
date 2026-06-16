package com.buy.skyit.controller;

import com.buy.skyit.user.facade.UserFacade;
import com.buy.skyit.user.facade.dto.UpdateProfileRequest;
import com.buy.skyit.user.facade.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {
    private final UserFacade userFacade;

    @PutMapping("/update/profile")
    public void updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest,@AuthenticationPrincipal Jwt jwt){
        String keycloakId = jwt.getSubject();
        userFacade.updateProfile(keycloakId, updateProfileRequest);
    }

    @GetMapping("/me")
    public UserProfileResponse getMyProfile() {
        return userFacade.getMyProfile();
    }

}
