package com.buy.skyit.skill.model.dto;

import lombok.Builder;

@Builder
public record UserSkillResponse(
        Long id,
        Long skillId,
        String skillName,
        String category,
        String level,
        Integer progress,
        Boolean isWeak
) {
}