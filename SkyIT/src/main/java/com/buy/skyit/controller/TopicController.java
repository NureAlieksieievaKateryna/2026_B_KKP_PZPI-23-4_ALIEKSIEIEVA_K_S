package com.buy.skyit.controller;

import com.buy.skyit.question.facade.dto.CreateTopicRequest;
import com.buy.skyit.question.facade.dto.TopicResponse;
import com.buy.skyit.question.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public TopicResponse createTopic(@RequestBody CreateTopicRequest request) {
        return topicService.createTopic(request);
    }

    @GetMapping
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics();
    }
}
