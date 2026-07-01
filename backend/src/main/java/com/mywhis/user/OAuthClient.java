package com.mywhis.user;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OAuthClient {
    private final RestClient http = RestClient.create();
    public SocialProfile fetch(String provider, String accessToken){
        return switch(provider){
            case "kakao" -> kakao(accessToken);
            case "naver" -> naver(accessToken);
            default -> throw new IllegalArgumentException("지원하지 않는 provider:" + provider);
        };
    }

    private SocialProfile kakao(String accessToken){
        try{
            JsonNode res = http.get()
                    .uri("https://kapi.kakao.com/v2/user/me")
                    .header("Authorization", "Bearer" + accessToken)
                    .retrieve()
                    .body(JsonNode.class);
            String id = res.path("id").asText();
            JsonNode account = res.path("kakao_account");
            String email = account.path("email").asText(null);
            String nickname = account.path("profile").path("nickname").asText("카카오사용자");
            return new SocialProfile("kakao", id, email, nickname);
        } catch (Exception e){
            throw new IllegalArgumentException("카카오 로그인 실패: " + e.getMessage());
        }
    }
    private SocialProfile naver(String accessToken){
        try{
            JsonNode res = http.get()
                    .uri("https://openapi.naver.com/v1/nid/me")
                    .header("Authorization", "Bearer" + accessToken)
                    .retrieve()
                    .body(JsonNode.class);

            JsonNode r = res.path("response");
            String id = r.path("id").asText();
            String email = r.path("email").asText(null);
            String nickname = r.path("nickname").asText("네이버 사용자");
            return new SocialProfile("naver", id, email, nickname);
        } catch (Exception e){
            throw new IllegalArgumentException("네이버 로그인 실패: " + e.getMessage());
        }
    }
}
