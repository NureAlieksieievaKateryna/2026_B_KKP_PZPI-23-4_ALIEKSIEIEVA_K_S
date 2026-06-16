package com.buy.skyit.question.service;

import com.buy.skyit.question.facade.dto.CreateTopicRequest;
import com.buy.skyit.question.facade.dto.TopicResponse;
import com.buy.skyit.question.model.TopicEntity;
import com.buy.skyit.question.repositrory.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    @Transactional
    public TopicResponse createTopic(CreateTopicRequest request) {

        if (topicRepository.existsByNameIgnoreCaseAndLevel(
                request.name(),
                request.level()
        )) {
            throw new RuntimeException("Topic already exists");
        }

        TopicEntity topic = new TopicEntity();
        topic.setName(request.name());
        topic.setDescription(request.description());
        topic.setLevel(request.level());

        return toResponse(topicRepository.save(topic));
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TopicResponse toResponse(TopicEntity topic) {
        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .level(topic.getLevel())
                .build();
    }
}

