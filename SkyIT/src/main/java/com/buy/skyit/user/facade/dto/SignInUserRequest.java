package com.buy.skyit.user.facade.dto;

import lombok.Builder;
import org.springframework.lang.NonNull;

@Builder
public record SignInUserRequest(@NonNull String login, @NonNull String password) {
}
