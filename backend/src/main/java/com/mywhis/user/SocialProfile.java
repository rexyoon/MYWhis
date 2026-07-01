package com.mywhis.user;

public record SocialProfile(
        String provider,
        String providerId,
        String email,
        String nickname
) {
}
