package com.buy.skyit.controller;

import com.buy.skyit.question.facade.dto.RepeatQuestionResponse;
import com.buy.skyit.question.service.RepeatQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question/repeat")
@RequiredArgsConstructor
public class RepeatQuestionController {

    private final RepeatQuestionService repeatQuestionService;

    @PostMapping("/{questionId}")
    public RepeatQuestionResponse saveForRepeat(
            @PathVariable Long questionId
    ) {
        return repeatQuestionService.saveForRepeat(questionId);
    }

    @GetMapping
    public List<RepeatQuestionResponse> getRepeatQuestions() {
        return repeatQuestionService.getRepeatQuestions();
    }
}
