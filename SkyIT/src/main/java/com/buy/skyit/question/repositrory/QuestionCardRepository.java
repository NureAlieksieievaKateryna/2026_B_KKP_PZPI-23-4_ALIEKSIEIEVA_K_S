package com.buy.skyit.question.repositrory;

import com.buy.skyit.question.model.QuestionCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionCardRepository extends JpaRepository<QuestionCardEntity, Long> {

    List<QuestionCardEntity> findByTopicId(Long topicId);
}