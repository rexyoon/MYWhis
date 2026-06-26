package com.mywhis.ai.dto;

import java.util.List;

public class RecommendationDtos {
    public record RecommendationItem(
            String name,
            String category,
            String type,
            String abv,
            String flavor,
            String reason
    ){}
    public record RecommendationResponse(
            List<RecommendationItem> recommendations
    ){}
    private RecommendationDtos(){}
}
