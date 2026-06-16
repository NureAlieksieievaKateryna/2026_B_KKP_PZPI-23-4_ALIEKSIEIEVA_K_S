package com.buy.skyit.resume.repository;

import com.buy.skyit.resume.model.ResumeReviewMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeReviewMessageRepository extends JpaRepository<ResumeReviewMessageEntity, Long> {

    List<ResumeReviewMessageEntity> findByResumeIdOrderByCreatedAtAsc(Long resumeId);
}