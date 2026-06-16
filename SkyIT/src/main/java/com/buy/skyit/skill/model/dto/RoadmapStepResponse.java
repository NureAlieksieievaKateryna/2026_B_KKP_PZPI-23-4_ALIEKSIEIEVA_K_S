package com.buy.skyit.skill.model.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record RoadmapStepResponse(
        Integer orderNumber,
        String title,
        String description,
        String level,
        Boolean weakSkill,
        Integer currentProgress,
        List<String> tasks
) {
}