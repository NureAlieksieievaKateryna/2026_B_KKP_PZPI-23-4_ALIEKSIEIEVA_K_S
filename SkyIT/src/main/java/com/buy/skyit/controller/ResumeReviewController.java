package com.buy.skyit.controller;

import com.buy.skyit.resume.dto.AddResumeMessageRequest;
import com.buy.skyit.resume.dto.ResumeResponse;
import com.buy.skyit.resume.service.ResumeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/resumes")
@RequiredArgsConstructor
public class ResumeReviewController {

    private final ResumeReviewService resumeReviewService;

    @PostMapping("/upload")
    public ResumeResponse uploadResume(@RequestParam("file") MultipartFile file) {
        return resumeReviewService.uploadResume(file);
    }

    @GetMapping("/{resumeId}")
    public ResumeResponse getResume(@PathVariable Long resumeId) {
        return resumeReviewService.getResume(resumeId);
    }

    @GetMapping("/my")
    public List<ResumeResponse> getMyResumes() {
        return resumeReviewService.getMyResumes();
    }

    @PostMapping("/{resumeId}/messages")
    public ResumeResponse addMessage(
            @PathVariable Long resumeId,
            @RequestBody AddResumeMessageRequest request
    ) {
        return resumeReviewService.addMessage(resumeId, request);
    }
}
