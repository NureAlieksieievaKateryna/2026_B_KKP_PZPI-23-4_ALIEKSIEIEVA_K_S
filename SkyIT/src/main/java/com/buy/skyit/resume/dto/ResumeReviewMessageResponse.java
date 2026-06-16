package com.buy.skyit.resume.dto;

import lombok.Builder;

@Builder
public record ResumeReviewMessageResponse(
        Long id,
        String role,
        String message,
        Integer startIndex,
        Integer endIndex,
        String selectedText
) {
}
