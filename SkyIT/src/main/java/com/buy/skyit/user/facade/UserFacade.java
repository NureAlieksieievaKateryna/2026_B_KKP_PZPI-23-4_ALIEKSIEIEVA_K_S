package com.buy.skyit.user.facade;

import com.buy.skyit.common.mappers.UserMapper;
import com.buy.skyit.common.models.Country;
import com.buy.skyit.common.models.DesiredLevel;
import com.buy.skyit.common.models.OfficeType;
import com.buy.skyit.common.models.TargetPosition;
import com.buy.skyit.mail.MailService;
import com.buy.skyit.user.facade.dto.SignUpUserRequest;
import com.buy.skyit.user.facade.dto.UpdateProfileRequest;
import com.buy.skyit.user.facade.dto.UserProfileResponse;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.model.UserProfileEntity;
import com.buy.skyit.user.service.CurrentUserService;
import com.buy.skyit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFacade {

    private final UserService userService;
    private final MailService mailService;
    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;



    public void updateProfile(String keycloakId, UpdateProfileRequest request) {

        UserEntity user = userService.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userService.updateProfile(user, request);
    }


    public UserProfileResponse getMyProfile() {
        return userMapper.toResponse(userService.getMyProfile());
    }
}
