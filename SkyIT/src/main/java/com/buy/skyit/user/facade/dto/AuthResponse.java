package com.buy.skyit.user.facade.dto;

import lombok.Builder;

@Builder
public record AuthResponse(String token) {
}
