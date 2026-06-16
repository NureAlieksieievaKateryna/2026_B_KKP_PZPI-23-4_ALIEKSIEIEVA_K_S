package com.buy.skyit.common.mappers;

import com.buy.skyit.skill.model.UserSkillEntity;
import com.buy.skyit.skill.model.dto.UserSkillResponse;
import com.buy.skyit.user.facade.dto.UserProfileResponse;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.model.UserProfileEntity;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserProfileResponse toResponse(UserProfileEntity profile) {

        UserEntity user = profile.getUser();

        return UserProfileResponse.builder()
                .userId(user.getId())
                .userName(user.getUserName())
                .login(user.getLogin())
                .email(user.getEmail())
                .fullName(profile.getFullName())
                .targetPosition(
                        Optional.ofNullable(profile.getTargetPosition())
                                .map(Enum::name)
                                .orElse(null)
                )
                .currentLevel(
                        Optional.ofNullable(profile.getCurrentLevel())
                                .map(Enum::name)
                                .orElse(null)
                )
                .desiredLevel(
                        Optional.ofNullable(profile.getDesiredLevel())
                                .map(Enum::name)
                                .orElse(null)
                )
                .country(
                        Optional.ofNullable(profile.getCountry())
                                .map(Enum::name)
                                .orElse(null)
                )
                .officeType(
                        Optional.ofNullable(profile.getOfficeType())
                                .map(Enum::name)
                                .orElse(null)
                )

                .bio(profile.getBio())

                .helpfulLinksUrl(profile.getHelpfulLinksUrl())

                .skills(
                        profile.getSkills()
                                .stream()
                                .map(this::mapSkill)
                                .collect(Collectors.toSet())
                )

                .build();
    }

    private UserSkillResponse mapSkill(UserSkillEntity skill) {

        return UserSkillResponse.builder()
                .id(skill.getId())

                .skillId(skill.getSkill().getId())

                .skillName(skill.getSkill().getName())

                .category(skill.getSkill().getCategory())

                .level(
                        Optional.ofNullable(skill.getLevel())
                                .map(Enum::name)
                                .orElse(null)
                )

                .progress(skill.getProgress())

                .isWeak(skill.getIsWeak())

                .build();
    }
}
