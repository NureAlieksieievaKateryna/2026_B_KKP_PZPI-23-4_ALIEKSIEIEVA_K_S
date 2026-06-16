package com.buy.skyit.resume.dto;

public record AddResumeMessageRequest(
        String message,
        Integer startIndex,
        Integer endIndex,
        String selectedText
) {
}
