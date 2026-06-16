package com.buy.skyit.skill.model.dto;

import lombok.Builder;

@Builder
public record UserSkillRequest(
        Long skillId,
        String level,
        Integer progress,
        Boolean isWeak
) {
}
