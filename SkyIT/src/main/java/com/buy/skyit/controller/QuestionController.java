package com.buy.skyit.controller;

import com.buy.skyit.question.facade.dto.QuestionCardResponse;
import com.buy.skyit.question.service.QuestionCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("question")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionCardService questionCardService;


    @PostMapping("/generate/topic/{topicId}")
    public List<QuestionCardResponse> generateByTopic(@PathVariable Long topicId) {
        return questionCardService.generateQuestionCards(topicId);
    }

    @GetMapping("/topic/{topicId}")
    public List<QuestionCardResponse> getByTopic(@PathVariable Long topicId) {
        return questionCardService.getByTopic(topicId);
    }
}
