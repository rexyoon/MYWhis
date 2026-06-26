package com.mywhis.security;

import org.springframework.security.core.context.SecurityContextHolder;

import io.jsonwebtoken.security.SignatureException;
import java.util.UUID;

public final class CurrentUser {
    public static UUID id(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !(auth.getPrincipal() instanceof UUID userId)){
            throw new SignatureException("인증된 사용자가 없습니다.");
        }
        return userId;
    }
    private CurrentUser(){}
}
