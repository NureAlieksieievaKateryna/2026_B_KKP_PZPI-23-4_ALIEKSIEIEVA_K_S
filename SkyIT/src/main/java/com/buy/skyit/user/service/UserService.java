package com.buy.skyit.user.service;

import com.buy.skyit.common.constrains.UserRole;
import com.buy.skyit.common.models.Country;
import com.buy.skyit.common.models.DesiredLevel;
import com.buy.skyit.common.models.OfficeType;
import com.buy.skyit.common.models.TargetPosition;
import com.buy.skyit.skill.model.SkillEntity;
import com.buy.skyit.skill.model.UserSkillEntity;
import com.buy.skyit.skill.model.dto.UserSkillRequest;
import com.buy.skyit.skill.repository.SkillRepository;
import com.buy.skyit.user.facade.dto.UpdateProfileRequest;
import com.buy.skyit.user.model.UserEntity;
import com.buy.skyit.user.model.UserProfileEntity;
import com.buy.skyit.user.repository.UserProfileRepository;
import com.buy.skyit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrentUserService currentUserService;
    private final SkillRepository skillRepository;

    public Optional<UserEntity> findUserByLogin(String login) {
        return userRepository.findUserByLogin(login);
    }

    @Transactional
    public UserEntity getOrCreateUser(Jwt jwt) {

        String keycloakId = jwt.getSubject();

        return userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> {
                    UserEntity user = new UserEntity();

                    user.setKeycloakId(keycloakId);
                    user.setEmail(jwt.getClaimAsString("email"));
                    user.setLogin(jwt.getClaimAsString("preferred_username"));
                    user.setUserName(jwt.getClaimAsString("name"));
                    user.setRole(UserRole.USER);
                    user.setIsActive(true);

                    return userRepository.save(user);
                });
    }

    public Optional<UserEntity> findUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<UserEntity> findByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId);
    }

    public Boolean findByUserLogin(String login) {
        return userRepository.existsByLogin(login);
    }

    @Transactional
    public void updateProfile(UserEntity entity, UpdateProfileRequest request) {
        UserProfileEntity profile = entity.getProfile();

        profile.setFullName(request.fullName());
        profile.setTargetPosition(TargetPosition.valueOf(request.targetPosition()));
        profile.setCurrentLevel(DesiredLevel.valueOf(request.currentLevel()));
        profile.setDesiredLevel(DesiredLevel.valueOf(request.desiredLevel()));
        profile.setCountry(Country.valueOf(request.country()));
        profile.setOfficeType(OfficeType.valueOf(request.officeType()));
        profile.setBio(request.bio());
        profile.setHelpfulLinksUrl(request.helpfulLinksUrl());

        profile.getSkills().clear();

        if (request.skills() != null) {
            for (UserSkillRequest skillRequest : request.skills()) {

                SkillEntity skill = skillRepository.findById(skillRequest.skillId())
                        .orElseThrow(() -> new RuntimeException("Skill not found"));

                UserSkillEntity userSkill = new UserSkillEntity();

                userSkill.setUserProfile(profile);
                userSkill.setSkill(skill);
                userSkill.setLevel(DesiredLevel.valueOf(skillRequest.level()));
                userSkill.setProgress(skillRequest.progress() != null ? skillRequest.progress() : 0);
                userSkill.setIsWeak(skillRequest.isWeak() != null ? skillRequest.isWeak() : false);

                profile.getSkills().add(userSkill);
            }
        }

        userProfileRepository.save(profile);
    }

    @Transactional
    public UserProfileEntity getMyProfile() {

        UserEntity user = currentUserService.getCurrentUser();

        if (user.getProfile() == null) {

            UserProfileEntity profile = new UserProfileEntity();

            profile.setUser(user);

            profile.setFullName(user.getUserName());

            profile.setTargetPosition(TargetPosition.JAVA_DEVELOPER);
            profile.setCurrentLevel(DesiredLevel.JUNIOR);

            profile.setDesiredLevel(DesiredLevel.MIDDLE);

            user.setProfile(profile);

            userRepository.save(user);
        }

        return user.getProfile();
    }



    @Transactional
    public void updateUser(UserEntity entity, UpdateProfileRequest request){
        entity.setUserName(request.userName());
        entity.setLogin(request.login());
        entity.setEmail(request.email());
        userRepository.save(entity);
    }
}
