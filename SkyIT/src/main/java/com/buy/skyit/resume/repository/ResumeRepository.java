package com.buy.skyit.resume.repository;

import com.buy.skyit.resume.model.ResumeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

    List<ResumeEntity> findByUserIdOrderByUploadedAtDesc(Long userId);
}
