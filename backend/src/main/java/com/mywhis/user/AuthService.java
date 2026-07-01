package com.mywhis.user;

import com.mywhis.security.JwtTokenProvider;
import com.mywhis.user.dto.AuthDtos.AuthResponse;
import com.mywhis.user.dto.AuthDtos.LoginRequest;
import com.mywhis.user.dto.AuthDtos.SignupRequest;
import java.time.OffsetDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final OAuthClient oAuthClient;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            OAuthClient oAuthClient
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.oAuthClient = oAuthClient;
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        User user = User.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .nickname(req.nickname())
                .createdAt(OffsetDateTime.now())
                .build();
        userRepository.save(user);
        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getNickname());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getNickname());
    }

    @Transactional
    public AuthResponse socialLogin(String provider, String accessToken) {
        SocialProfile p = oAuthClient.fetch(provider, accessToken);

        User user = userRepository
                .findByProviderAndProviderId(p.provider(), p.providerId())
                .orElseGet(() -> userRepository.save(User.builder()
                        .provider(p.provider())
                        .providerId(p.providerId())
                        .email(p.email())
                        .nickname(p.nickname())
                        .createdAt(OffsetDateTime.now())
                        .build()));

        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getNickname());
    }
}