package com.mywhis.ai;

import com.mywhis.ai.dto.RecommendationDtos;
import com.mywhis.security.CurrentUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;
    public RecommendationController(RecommendationService recommendationService){
        this.recommendationService = recommendationService;
    }

    @GetMapping("/ai")
    public RecommendationDtos.RecommendationResponse ai(@RequestParam(defaultValue = "3")int count){
        int n = Math.max(1, Math.min(count, 10));
        return recommendationService.recommend(CurrentUser.id(), n);
    }
}
