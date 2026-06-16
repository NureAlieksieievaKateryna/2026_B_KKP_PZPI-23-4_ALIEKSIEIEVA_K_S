package com.buy.skyit.vacancy.model;


import com.buy.skyit.common.models.DesiredLevel;
import com.buy.skyit.skill.model.SkillEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "vacancy_skills")
public class VacancySkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id")
    private VacancyEntity vacancy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private SkillEntity skill;

    @Enumerated(EnumType.STRING)
    private DesiredLevel requiredLevel;
}