package com.buy.skyit.interview.service.dto;

import lombok.Builder;

@Builder
public record MockInterviewRequest(String targetPosition,
         String level,
         String question,
         String answer) {
}
