package com.mywhis.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mywhis.ai.dto.RecommendationDtos.RecommendationItem;
import com.mywhis.ai.dto.RecommendationDtos.RecommendationResponse;
import com.mywhis.bottle.BottleService;
import com.mywhis.bottle.dto.BottleDtos.BottleResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** 사용자 컬렉션을 분석해 제미나이로 새 위스키를 추천한다. */
@Service
public class RecommendationService {

    private final BottleService bottleService;
    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public RecommendationService(
            BottleService bottleService,
            GeminiClient geminiClient,
            ObjectMapper objectMapper
    ) {
        this.bottleService = bottleService;
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    public RecommendationResponse recommend(UUID userId, int count) {
        List<BottleResponse> bottles = bottleService.list(userId);
        String prompt = buildPrompt(bottles, count);
        String json = geminiClient.generateJson(prompt, responseSchema());

        try {
            List<RecommendationItem> items = objectMapper.readValue(
                    json,
                    objectMapper.getTypeFactory()
                            .constructCollectionType(List.class, RecommendationItem.class)
            );
            return new RecommendationResponse(items);
        } catch (Exception e) {
            throw new AiException("AI 응답 파싱에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildPrompt(List<BottleResponse> bottles, int count) {
        String collection = bottles.isEmpty()
                ? "아직 보유한 위스키가 없는 입문자입니다. 입문자에게 좋은 것들로 추천해주세요."
                : bottles.stream()
                  .map(b -> "- " + b.name()
                            + " (" + (b.categoryLabel() == null ? "종류미상" : b.categoryLabel())
                            + (b.subtypeLabel() == null ? "" : "/" + b.subtypeLabel()) + ")")
                  .collect(Collectors.joining("\n"));

        return """
            당신은 전문 위스키 소믈리에입니다.
            아래 [사용자 보유 컬렉션]의 취향(종류·지역·풍미)을 분석해서,
            사용자가 아직 보유하지 않은 새로운 위스키 %d개를 추천하세요.
            너무 비슷한 것만 고르지 말고 다양성도 고려하고, 모든 설명은 한국어로 작성하세요.

            [사용자 보유 컬렉션]
            %s

            각 추천 항목의 필드:
            - name: 위스키 이름
            - category: 종류 (위스키 / 스카치위스키 / 버번 / 피트위스키 / 사케 / 기타)
            - type: 세부분류나 지역 (예: 싱글몰트, 아일라)
            - abv: 도수 (예: "43%%")
            - flavor: 맛 프로필 한 줄
            - reason: 이 사용자에게 추천하는 이유 (1~2문장)
            """.formatted(count, collection);
    }

    /** Gemini responseSchema: RecommendationItem 들의 배열 */
    private Map<String, Object> responseSchema() {
        Map<String, Object> item = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "name", Map.of("type", "STRING"),
                        "category", Map.of("type", "STRING"),
                        "type", Map.of("type", "STRING"),
                        "abv", Map.of("type", "STRING"),
                        "flavor", Map.of("type", "STRING"),
                        "reason", Map.of("type", "STRING")
                ),
                "required", List.of("name", "category", "reason")
        );
        return Map.of("type", "ARRAY", "items", item);
    }
}