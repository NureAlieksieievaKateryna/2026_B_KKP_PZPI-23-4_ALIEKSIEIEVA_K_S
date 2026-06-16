package com.buy.skyit.vacancy.model;

import com.buy.skyit.common.models.DesiredLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "vacancies")
public class VacancyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    @Column(length = 10000)
    private String description;

    private Integer salaryFrom;

    private Integer salaryTo;

    private String currency;

    private String location;

    private Boolean remote;

    @Enumerated(EnumType.STRING)
    private DesiredLevel level;

    private String source;

    @Column(unique = true, length = 1000)
    private String sourceUrl;

    @Column(columnDefinition = "jsonb")
    private String rawData;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "vacancy",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<VacancySkillEntity> skills = new HashSet<>();

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
    }
}
