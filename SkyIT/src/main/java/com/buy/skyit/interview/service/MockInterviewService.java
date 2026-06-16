package com.buy.skyit.interview.service;

import com.buy.skyit.interview.service.dto.MockInterviewRequest;
import com.buy.skyit.interview.service.dto.MockInterviewResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public MockInterviewResponse askQuestion(MockInterviewRequest request) {
        String prompt = """
                Generate one technical interview question.

                Target position: %s
                Level: %s

                Return ONLY one valid JSON object.
                Do not add explanations.
                Do not use markdown.
                Do not use code blocks.
                Do not use triple quotes.
                Do not use multiline strings.
                Do not use arrays.

                IMPORTANT:
                The response must start with { and end with }.
                All fields are required.
                correctAnswer must be a short plain text answer, not code.
                Do not put line breaks inside JSON string values.

                JSON format:
                {
                  "question": "string",
                  "feedback": "",
                  "score": 0,
                  "correctAnswer": "string"
                }
                """.formatted(
                request.targetPosition(),
                request.level()
        );

        return parseAiResponse(prompt);
    }

    public MockInterviewResponse evaluateAnswer(MockInterviewRequest request) {
        String prompt = """
                Evaluate user's interview answer.

                Question:
                %s

                User answer:
                %s

                Return ONLY one valid JSON object.
                Do not add explanations.
                Do not use markdown.
                Do not use code blocks.
                Do not use triple quotes.
                Do not use multiline strings.
                Do not use arrays.

                IMPORTANT:
                The response must start with { and end with }.
                All fields are required.
                score must be from 0 to 100.
                feedback must be short plain text.
                correctAnswer must be short plain text, not code.
                Do not put line breaks inside JSON string values.

                JSON format:
                {
                  "question": "string",
                  "feedback": "string",
                  "score": 0,
                  "correctAnswer": "string"
                }
                """.formatted(
                request.question(),
                request.answer()
        );

        return parseAiResponse(prompt);
    }

    private MockInterviewResponse parseAiResponse(String prompt) {
        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        try {
            String json = extractJson(content);
            json = cleanJson(json);

            return objectMapper.readValue(json, MockInterviewResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Cannot parse AI mock interview response: " + content, e);
        }
    }

    private String extractJson(String content) {
        if (content == null || content.isBlank()) {
            throw new RuntimeException("AI response is empty");
        }

        int start = content.indexOf("{");
        int end = content.lastIndexOf("}");

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("AI response does not contain JSON: " + content);
        }

        return content.substring(start, end + 1);
    }

    private String cleanJson(String json) {
        return json
                .replace("```json", "")
                .replace("```", "")
                .replace("\"\"\"", "\"")
                .trim();
    }
}