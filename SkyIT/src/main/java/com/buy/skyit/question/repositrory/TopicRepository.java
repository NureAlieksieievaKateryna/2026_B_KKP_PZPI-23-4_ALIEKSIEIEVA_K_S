package com.buy.skyit.question.repositrory;

import com.buy.skyit.common.models.DesiredLevel;
import com.buy.skyit.question.model.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<TopicEntity, Long> {
    boolean existsByNameIgnoreCaseAndLevel(String name, DesiredLevel level);
}