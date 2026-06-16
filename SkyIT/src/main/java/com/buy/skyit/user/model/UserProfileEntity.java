package com.buy.skyit.user.model;

import com.buy.skyit.common.models.*;
import com.buy.skyit.skill.model.UserSkillEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "user_profiles")
public class UserProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetPosition targetPosition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DesiredLevel currentLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DesiredLevel desiredLevel;

    @Enumerated(EnumType.STRING)
    private Country country;

    @Enumerated(EnumType.STRING)
    private OfficeType officeType;

    @Column(length = 3000)
    private String bio;

    @OneToMany(
            mappedBy = "userProfile",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<UserSkillEntity> skills = new HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "user_profile_links",
            joinColumns = @JoinColumn(name = "user_profile_id")
    )
    @Column(name = "url")
    private Set<String> helpfulLinksUrl = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();
    }
}