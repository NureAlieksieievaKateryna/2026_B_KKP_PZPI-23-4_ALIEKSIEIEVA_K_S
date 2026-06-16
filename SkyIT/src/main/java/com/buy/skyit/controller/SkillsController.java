package com.buy.skyit.controller;

import com.buy.skyit.skill.model.dto.SkillsRoadmapResponse;
import com.buy.skyit.skill.service.SkillsRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("skills")
@RequiredArgsConstructor
public class SkillsController {

     private final SkillsRoadmapService skillsRoadmapService;

    @GetMapping("/roadmap")
    public SkillsRoadmapResponse getRoadmap() {
        return skillsRoadmapService.generateRoadmap();
    }
}
