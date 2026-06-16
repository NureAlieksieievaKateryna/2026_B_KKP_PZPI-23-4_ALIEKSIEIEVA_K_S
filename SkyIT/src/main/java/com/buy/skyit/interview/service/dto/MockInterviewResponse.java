package com.buy.skyit.interview.service.dto;

import lombok.Builder;

@Builder
public record MockInterviewResponse(String question,
         String feedback,
         Integer score,
         String correctAnswer) {
}
