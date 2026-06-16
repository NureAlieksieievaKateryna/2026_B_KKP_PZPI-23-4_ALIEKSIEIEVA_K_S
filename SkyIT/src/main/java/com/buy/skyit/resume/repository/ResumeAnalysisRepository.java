package com.buy.skyit.resume.repository;

import com.buy.skyit.resume.model.ResumeAnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysisEntity, Long> {

    Optional<ResumeAnalysisEntity> findByResumeId(Long resumeId);
}