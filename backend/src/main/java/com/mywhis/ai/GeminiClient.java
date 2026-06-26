package com.mywhis.ai;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Google Gemini REST API 호출 래퍼.
 * API 키는 app.gemini.api-key (환경변수 GEMINI_API_KEY) 로 주입. 없으면 AiException.
 */
@Component
public class GeminiClient {
    private final RestClient restClient;
    private final String apiKey;
    private final String model;
    public GeminiClient(
            @Value("${app.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.model:gemini-2.0-flash}") String model
    ) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.model = model;
    }
    /** 프롬프트 + 응답 JSON 스키마를 보내고, 모델이 생성한 JSON 문자열을 돌려준다. */
    public String generateJson(String prompt, Map<String, Object> responseSchema) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiException("GEMINI_API_KEY가 설정되지 않았습니다. 환경변수에 키를 넣어주세요.");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "responseSchema", responseSchema
                )
        );
        try {
            JsonNode res = restClient.post()
                    .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);
            if (res == null) {
                throw new AiException("Gemini 응답이 비어 있습니다.");
            }
            JsonNode text = res.at("/candidates/0/content/parts/0/text");
            if (text.isMissingNode()) {
                throw new AiException("Gemini 응답 형식이 예상과 다릅니다: " + res);
            }
            return text.asText();
        } catch (AiException e) {
            throw e;
        } catch (Exception e) {
            throw new AiException("Gemini 호출 실패: " + e.getMessage());
        }
    }
}