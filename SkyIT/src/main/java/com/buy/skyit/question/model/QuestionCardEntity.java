package com.buy.skyit.question.model;

import com.buy.skyit.common.models.DesiredLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "question_cards")
public class QuestionCardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="topic_id")
    private TopicEntity topic;

    @Column(length = 5000)
    private String question;

    @Column(length = 5000)
    private String shortAnswer;

    @Column(length = 20000)
    private String fullAnswer;

    @Enumerated(EnumType.STRING)
    private DesiredLevel difficulty;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
    }
}
