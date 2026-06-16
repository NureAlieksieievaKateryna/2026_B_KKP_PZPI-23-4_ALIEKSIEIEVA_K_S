package com.buy.skyit.question.service;

import com.buy.skyit.question.facade.dto.QuestionCardAiDto;
import com.buy.skyit.question.facade.dto.QuestionCardResponse;
import com.buy.skyit.question.model.QuestionCardEntity;
import com.buy.skyit.question.model.TopicEntity;
import com.buy.skyit.question.repositrory.QuestionCardRepository;
import com.buy.skyit.question.repositrory.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionCardService {


    private final TopicRepository topicRepository;
    private final QuestionCardRepository questionCardRepository;
    private final QuestionCardAiService questionCardAiService;

    @Transactional
    public List<QuestionCardResponse> generateQuestionCards(Long topicId) {

        TopicEntity topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        List<QuestionCardAiDto> aiCards =
                questionCardAiService.generateCards(topic);

        List<QuestionCardEntity> cards = aiCards.stream()
                .map(dto -> {
                    QuestionCardEntity card = new QuestionCardEntity();
                    card.setTopic(topic);
                    card.setQuestion(dto.question());
                    card.setShortAnswer(dto.shortAnswer());
                    card.setFullAnswer(dto.fullAnswer());
                    card.setDifficulty(topic.getLevel());
                    return card;
                })
                .toList();

        return questionCardRepository.saveAll(cards)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuestionCardResponse> getByTopic(Long topicId) {
        return questionCardRepository.findByTopicId(topicId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private QuestionCardResponse toResponse(QuestionCardEntity card) {
        return QuestionCardResponse.builder()
                .id(card.getId())
                .topicId(card.getTopic().getId())
                .topicName(card.getTopic().getName())
                .question(card.getQuestion())
                .shortAnswer(card.getShortAnswer())
                .fullAnswer(card.getFullAnswer())
                .difficulty(card.getDifficulty())
                .build();
    }
}
