package com.buy.skyit.question.facade.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RepeatQuestionResponse(Long questionId,

                                     String question,

                                     Boolean repeatLater,
                                     Integer repeatCount,

                                     LocalDateTime nextRepeatAt) {
}
