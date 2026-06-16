package com.buy.skyit.user.facade.dto;

import com.buy.skyit.common.models.Country;
import com.buy.skyit.common.models.DesiredLevel;
import com.buy.skyit.common.models.OfficeType;
import com.buy.skyit.common.models.TargetPosition;
import lombok.Builder;
import org.springframework.lang.NonNull;

import java.util.Set;

@Builder
public record SignUpUserRequest(@NonNull String userName,
                                @NonNull String login,
                                String email,
                                String password,
                                @NonNull String fullName,
                                TargetPosition targetPosition,
                                @NonNull DesiredLevel currentLevel,
                                @NonNull DesiredLevel desiredLevel,
                                @NonNull Country country,
                                @NonNull OfficeType officeType,
                                @NonNull String bio,
                                @NonNull Set<String> helpfulLinksUrl) {
}
