package com.buy.skyit.controller;

import com.buy.skyit.interview.service.MockInterviewService;
import com.buy.skyit.interview.service.dto.MockInterviewRequest;
import com.buy.skyit.interview.service.dto.MockInterviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock-interview")
@RequiredArgsConstructor
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    @PostMapping("/ask")
    public MockInterviewResponse askQuestion(@RequestBody MockInterviewRequest request) {
        return mockInterviewService.askQuestion(request);
    }

    @PostMapping("/evaluate")
    public MockInterviewResponse evaluateAnswer(@RequestBody MockInterviewRequest request) {
        return mockInterviewService.evaluateAnswer(request);
    }
}