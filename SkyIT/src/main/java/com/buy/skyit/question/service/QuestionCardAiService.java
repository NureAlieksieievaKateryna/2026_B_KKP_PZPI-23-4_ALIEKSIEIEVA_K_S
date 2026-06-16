package com.buy.skyit.question.service;

import com.buy.skyit.question.facade.dto.QuestionCardAiDto;
import com.buy.skyit.question.model.TopicEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionCardAiService {

    private final ChatClient chatClient;

    public List<QuestionCardAiDto> generateCards(TopicEntity topic) {

        String prompt = """
                Generate 5 interview question cards.

                Topic: %s
                Description: %s
                Level: %s

                Return result ONLY in this format:

                QUESTION: ...
                SHORT_ANSWER: ...
                FULL_ANSWER: ...

                QUESTION: ...
                SHORT_ANSWER: ...
                FULL_ANSWER: ...
                """.formatted(
                topic.getName(),
                topic.getDescription(),
                topic.getLevel()
        );

        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return this.parseResponse(response);
    }

    private List<QuestionCardAiDto> parseResponse(String response) {
        List<QuestionCardAiDto> result = new ArrayList<>();

        String[] blocks = response.split("QUESTION:");

        for (String block : blocks) {
            if (block.isBlank()) continue;

            String question = getBetween(block, "", "SHORT_ANSWER:");
            String shortAnswer = getBetween(block, "SHORT_ANSWER:", "FULL_ANSWER:");
            String fullAnswer = getAfter(block, "FULL_ANSWER:");

            result.add(new QuestionCardAiDto(
                    question.trim(),
                    shortAnswer.trim(),
                    fullAnswer.trim()
            ));
        }

        return result;
    }

    private String getBetween(String text, String start, String end) {
        int startIndex = start.isBlank() ? 0 : text.indexOf(start) + start.length();
        int endIndex = text.indexOf(end);

        if (endIndex == -1) return text.substring(startIndex);

        return text.substring(startIndex, endIndex);
    }

    private String getAfter(String text, String marker) {
        int index = text.indexOf(marker);

        if (index == -1) return "";

        return text.substring(index + marker.length());
    }
}
