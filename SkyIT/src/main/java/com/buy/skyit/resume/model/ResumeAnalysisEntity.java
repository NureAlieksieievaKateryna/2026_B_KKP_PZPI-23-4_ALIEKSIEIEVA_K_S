package com.buy.skyit.resume.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private ResumeEntity resume;

    @Column(length = 50000)
    private String extractedText;

    @Column(length = 10000)
    private String strengths;

    @Column(length = 10000)
    private String weaknesses;

    @Column(length = 10000)
    private String recommendations;

    @Column(length = 10000)
    private String summary;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
    }
}