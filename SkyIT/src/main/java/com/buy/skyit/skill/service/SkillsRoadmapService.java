package com.buy.skyit.skill.service;

import com.buy.skyit.skill.model.dto.SkillsRoadmapResponse;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.model.UserProfileEntity;
import com.buy.skyit.user.service.CurrentUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillsRoadmapService {

    private final CurrentUserService currentUserService;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public SkillsRoadmapResponse generateRoadmap() {
        UserEntity user = currentUserService.getCurrentUser();
        UserProfileEntity profile = user.getProfile();

        String skillsText = profile.getSkills()
                .stream()
                .map(userSkill -> """
                        Skill: %s
                        Category: %s
                        Description: %s
                        Level: %s
                        Progress: %s
                        Weak: %s
                        """.formatted(
                        userSkill.getSkill().getName(),
                        userSkill.getSkill().getCategory(),
                        userSkill.getSkill().getDescription(),
                        userSkill.getLevel(),
                        userSkill.getProgress(),
                        userSkill.getIsWeak()
                ))
                .collect(Collectors.joining("\n"));

        String prompt = """
                Generate a personalized skills roadmap.

                User target position: %s
                Current level: %s
                Desired level: %s

                User skills:
                %s

                IMPORTANT:
                Return ONLY valid JSON.
                Do NOT add explanations.
                Do NOT add markdown.
                Do NOT add text before JSON.
                Do NOT add text after JSON.

                JSON format:
                {
                  "targetPosition": "%s",
                  "currentLevel": "%s",
                  "desiredLevel": "%s",
                  "steps": [
                    {
                      "orderNumber": 1,
                      "title": "string",
                      "description": "string",
                      "level": "string",
                      "weakSkill": true,
                      "currentProgress": 30,
                      "tasks": ["string", "string", "string"]
                    }
                  ]
                }
                """.formatted(
                profile.getTargetPosition(),
                profile.getCurrentLevel(),
                profile.getDesiredLevel(),
                skillsText,
                profile.getTargetPosition(),
                profile.getCurrentLevel(),
                profile.getDesiredLevel()
        );

        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        try {
            String json = extractJson(content);
            return objectMapper.readValue(json, SkillsRoadmapResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Cannot parse AI roadmap response: " + content, e);
        }
    }

    private String extractJson(String content) {
        if (content == null || content.isBlank()) {
            throw new RuntimeException("AI roadmap response is empty");
        }

        int start = content.indexOf("{");
        int end = content.lastIndexOf("}");

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("AI roadmap response does not contain JSON: " + content);
        }

        return content.substring(start, end + 1);
    }
}