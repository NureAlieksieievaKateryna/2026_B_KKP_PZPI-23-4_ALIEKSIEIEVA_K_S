package com.buy.skyit.question.repositrory;

import com.buy.skyit.question.model.UserQuestionProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserQuestionProgressRepository
        extends JpaRepository<UserQuestionProgressEntity, Long> {

    Optional<UserQuestionProgressEntity>
    findByUserIdAndQuestionId(Long userId, Long questionId);

    List<UserQuestionProgressEntity>
    findByUserIdAndRepeatLaterTrue(Long userId);
}
