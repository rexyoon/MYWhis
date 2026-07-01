package com.mywhis.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record SignupRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6, message = "비밀번호는 6자 이상이어야합니다.") String password,
            @NotBlank String nickname
    ){}
    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ){}
    public record AuthResponse(
            String token,
            String email,
            String nickname
    ){}
    public record SocialLoginRequest(
            @NotBlank  String accessToken
    ){}
    private AuthDtos(){}
}
