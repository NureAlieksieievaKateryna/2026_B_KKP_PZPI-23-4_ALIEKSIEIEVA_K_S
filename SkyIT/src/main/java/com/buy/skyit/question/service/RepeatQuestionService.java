package com.buy.skyit.question.service;

import com.buy.skyit.question.facade.dto.RepeatQuestionResponse;
import com.buy.skyit.question.model.QuestionCardEntity;
import com.buy.skyit.question.model.UserQuestionProgressEntity;
import com.buy.skyit.question.repositrory.QuestionCardRepository;
import com.buy.skyit.question.repositrory.UserQuestionProgressRepository;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepeatQuestionService {

    private final CurrentUserService currentUserService;
    private final QuestionCardRepository questionCardRepository;
    private final UserQuestionProgressRepository progressRepository;

    @Transactional
    public RepeatQuestionResponse saveForRepeat(Long questionId) {

        UserEntity user = currentUserService.getCurrentUser();

        QuestionCardEntity question =
                questionCardRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException("Question not found"));

        UserQuestionProgressEntity progress =
                progressRepository
                        .findByUserIdAndQuestionId(
                                user.getId(),
                                questionId
                        )
                        .orElseGet(UserQuestionProgressEntity::new);

        progress.setUser(user);
        progress.setQuestion(question);
        progress.setRepeatLater(true);

        progress.setRepeatCount(
                progress.getRepeatCount() == null
                        ? 1
                        : progress.getRepeatCount() + 1
        );

        progress.setNextRepeatAt(
                LocalDateTime.now().plusDays(1)
        );

        progressRepository.save(progress);

        return RepeatQuestionResponse.builder()
                .questionId(question.getId())
                .question(question.getQuestion())
                .repeatLater(progress.getRepeatLater())
                .repeatCount(progress.getRepeatCount())
                .nextRepeatAt(progress.getNextRepeatAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RepeatQuestionResponse> getRepeatQuestions() {

        UserEntity user = currentUserService.getCurrentUser();

        return progressRepository
                .findByUserIdAndRepeatLaterTrue(user.getId())
                .stream()
                .map(progress -> RepeatQuestionResponse.builder()
                        .questionId(progress.getQuestion().getId())
                        .question(progress.getQuestion().getQuestion())
                        .repeatLater(progress.getRepeatLater())
                        .repeatCount(progress.getRepeatCount())
                        .nextRepeatAt(progress.getNextRepeatAt())
                        .build()
                )
                .toList();
    }
}