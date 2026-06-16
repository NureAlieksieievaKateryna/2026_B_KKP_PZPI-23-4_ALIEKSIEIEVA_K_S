package com.buy.skyit.resume.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record ResumeResponse(
        Long resumeId,
        String fileName,
        String contentType,
        String fileUrl,
        String status,
        Integer score,
        String extractedText,
        String strengths,
        String weaknesses,
        String recommendations,
        String summary,
        List<ResumeReviewMessageResponse> messages
) {
}
