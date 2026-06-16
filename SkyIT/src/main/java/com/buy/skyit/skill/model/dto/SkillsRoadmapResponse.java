package com.buy.skyit.skill.model.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record SkillsRoadmapResponse(
        String targetPosition,
        String currentLevel,
        String desiredLevel,
        List<RoadmapStepResponse> steps
) {
}