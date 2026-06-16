package com.buy.skyit.question.facade.dto;

import com.buy.skyit.common.models.DesiredLevel;
import lombok.Builder;
import org.springframework.stereotype.Repository;

@Builder
public record CreateTopicRequest(String name,
                                 String description, DesiredLevel level) {
}
