package com.buy.skyit.user.facade.dto;

import com.buy.skyit.skill.model.dto.UserSkillRequest;
import lombok.Builder;

import java.util.Set;

@Builder
public record UpdateProfileRequest(
        String userName,
        String login,
        String email,
        String fullName,
        String targetPosition,
        String currentLevel,
        String desiredLevel,
        String country,
        String officeType,
        String bio,
        Set<String> helpfulLinksUrl,
        Set<UserSkillRequest> skills
) {
}
