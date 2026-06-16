package com.buy.skyit.user.facade.dto;

import com.buy.skyit.skill.model.dto.UserSkillResponse;
import lombok.Builder;

import java.util.Set;

@Builder
public record UserProfileResponse(Long userId, String userName,

                                  String login,

                                  String email,

                                  String fullName,

                                  String targetPosition,

                                  String currentLevel,
                                  Set<UserSkillResponse> skills,

                                  String desiredLevel,

                                  String country,

                                  String officeType,

                                  String bio,

                                  Set<String> helpfulLinksUrl) {
}
