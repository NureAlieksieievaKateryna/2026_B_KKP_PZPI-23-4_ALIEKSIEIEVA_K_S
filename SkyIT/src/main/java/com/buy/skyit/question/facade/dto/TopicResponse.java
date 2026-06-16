package com.buy.skyit.question.facade.dto;


import com.buy.skyit.common.models.DesiredLevel;
import lombok.Builder;

@Builder
public record TopicResponse(Long id,
                            String name,
                            String description,
                            DesiredLevel level) {
}
