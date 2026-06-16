package com.buy.skyit.question.facade.dto;

import com.buy.skyit.common.models.DesiredLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class QuestionCardResponse {

    private Long id;
    private Long topicId;
    private String topicName;
    private String question;
    private String shortAnswer;
    private String fullAnswer;
    private DesiredLevel difficulty;
}