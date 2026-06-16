package com.buy.skyit.resume.model;

import com.buy.skyit.common.models.ResumeStatus;
import com.buy.skyit.user.model.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "resumes")
public class ResumeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String contentType;

    private String objectKey;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    private ResumeStatus status;

    private Integer score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private LocalDateTime uploadedAt;

    private LocalDateTime analyzedAt;
    @OneToOne(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private ResumeAnalysisEntity analysis;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ResumeReviewMessageEntity> messages = new HashSet<>();

    @PrePersist
    public void prePersist() {

        uploadedAt = LocalDateTime.now();
    }
}