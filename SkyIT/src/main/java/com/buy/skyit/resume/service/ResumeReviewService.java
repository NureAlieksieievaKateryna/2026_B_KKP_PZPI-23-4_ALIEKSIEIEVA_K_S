package com.buy.skyit.resume.service;

import com.buy.skyit.common.models.MessageRole;
import com.buy.skyit.common.models.ResumeStatus;
import com.buy.skyit.resume.dto.AddResumeMessageRequest;
import com.buy.skyit.resume.dto.ResumeResponse;
import com.buy.skyit.resume.dto.ResumeReviewMessageResponse;
import com.buy.skyit.resume.model.ResumeAnalysisEntity;
import com.buy.skyit.resume.model.ResumeEntity;
import com.buy.skyit.resume.model.ResumeReviewMessageEntity;
import com.buy.skyit.resume.repository.ResumeAnalysisRepository;
import com.buy.skyit.resume.repository.ResumeRepository;
import com.buy.skyit.resume.repository.ResumeReviewMessageRepository;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeReviewService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository analysisRepository;
    private final ResumeReviewMessageRepository messageRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file) {
        try {
            UserEntity user = currentUserService.getCurrentUser();

            String extractedText = extractPdfText(file);

            ResumeEntity resume = new ResumeEntity();
            resume.setUser(user);
            resume.setFileName(file.getOriginalFilename());
            resume.setContentType(file.getContentType());
            resume.setStatus(ResumeStatus.ANALYZED);
            resume.setScore(calculateScore(extractedText));
            resume.setAnalyzedAt(LocalDateTime.now());

            resumeRepository.save(resume);

            ResumeAnalysisEntity analysis = new ResumeAnalysisEntity();
            analysis.setResume(resume);
            analysis.setExtractedText(extractedText);
            analysis.setStrengths(generateStrengths(extractedText));
            analysis.setWeaknesses(generateWeaknesses(extractedText));
            analysis.setRecommendations(generateRecommendations(extractedText));
            analysis.setSummary(generateSummary(extractedText));

            analysisRepository.save(analysis);

            ResumeReviewMessageEntity aiMessage = new ResumeReviewMessageEntity();
            aiMessage.setResume(resume);
            aiMessage.setRole(MessageRole.AI);
            aiMessage.setMessage("Resume uploaded and analyzed successfully. You can select any part of the resume text and ask a question about it.");
            messageRepository.save(aiMessage);

            return toResponse(resume);

        } catch (Exception e) {
            throw new RuntimeException("Resume upload failed", e);
        }
    }

    @Transactional(readOnly = true)
    public ResumeResponse getResume(Long resumeId) {
        ResumeEntity resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return toResponse(resume);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getMyResumes() {
        UserEntity user = currentUserService.getCurrentUser();

        return resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ResumeResponse addMessage(Long resumeId, AddResumeMessageRequest request) {
        ResumeEntity resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        ResumeReviewMessageEntity userMessage = new ResumeReviewMessageEntity();
        userMessage.setResume(resume);
        userMessage.setRole(MessageRole.USER);
        userMessage.setMessage(request.message());
        userMessage.setStartIndex(request.startIndex());
        userMessage.setEndIndex(request.endIndex());
        userMessage.setSelectedText(request.selectedText());
        messageRepository.save(userMessage);

        ResumeReviewMessageEntity aiMessage = new ResumeReviewMessageEntity();
        aiMessage.setResume(resume);
        aiMessage.setRole(MessageRole.AI);
        aiMessage.setStartIndex(request.startIndex());
        aiMessage.setEndIndex(request.endIndex());
        aiMessage.setSelectedText(request.selectedText());
        aiMessage.setMessage(generateAiAnswer(request));
        messageRepository.save(aiMessage);

        return toResponse(resume);
    }

    private String extractPdfText(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private Integer calculateScore(String text) {
        int score = 50;

        if (text.toLowerCase().contains("spring")) score += 10;
        if (text.toLowerCase().contains("docker")) score += 10;
        if (text.toLowerCase().contains("postgres")) score += 10;
        if (text.toLowerCase().contains("project")) score += 10;
        if (text.length() > 1500) score += 10;

        return Math.min(score, 100);
    }

    private String generateStrengths(String text) {
        return "The resume contains a technical stack and relevant experience. It can be used for an initial professional evaluation.";
    }

    private String generateWeaknesses(String text) {
        return "Check whether the resume includes measurable achievements, project descriptions, specific responsibilities, and quantifiable results.";
    }

    private String generateRecommendations(String text) {
        return "Add achievements, technical skills, project links, and concrete results of your work to improve the overall quality of the resume.";
    }

    private String generateSummary(String text) {
        return "Resume uploaded successfully. Total characters extracted: " + text.length();
    }

    private String generateAiAnswer(AddResumeMessageRequest request) {
        if (request.selectedText() != null && !request.selectedText().isBlank()) {
            return "Based on the selected text: \"" + request.selectedText() +
                    "\", consider adding more specific details, including your responsibilities, technologies used, and the outcome or impact of your work.";
        }

        return "You can select a specific section of your resume, and I will provide recommendations on how to improve it.";
    }

    private ResumeResponse toResponse(ResumeEntity resume) {
        ResumeAnalysisEntity analysis = analysisRepository.findByResumeId(resume.getId())
                .orElse(null);

        List<ResumeReviewMessageResponse> messages = messageRepository
                .findByResumeIdOrderByCreatedAtAsc(resume.getId())
                .stream()
                .map(this::toMessageResponse)
                .toList();

        return ResumeResponse.builder()
                .resumeId(resume.getId())
                .fileName(resume.getFileName())
                .contentType(resume.getContentType())
                .fileUrl(resume.getFileUrl())
                .status(resume.getStatus() != null ? resume.getStatus().name() : null)
                .score(resume.getScore())
                .extractedText(analysis != null ? analysis.getExtractedText() : null)
                .strengths(analysis != null ? analysis.getStrengths() : null)
                .weaknesses(analysis != null ? analysis.getWeaknesses() : null)
                .recommendations(analysis != null ? analysis.getRecommendations() : null)
                .summary(analysis != null ? analysis.getSummary() : null)
                .messages(messages)
                .build();
    }

    private ResumeReviewMessageResponse toMessageResponse(ResumeReviewMessageEntity message) {
        return ResumeReviewMessageResponse.builder()
                .id(message.getId())
                .role(message.getRole().name())
                .message(message.getMessage())
                .startIndex(message.getStartIndex())
                .endIndex(message.getEndIndex())
                .selectedText(message.getSelectedText())
                .build();
    }
}