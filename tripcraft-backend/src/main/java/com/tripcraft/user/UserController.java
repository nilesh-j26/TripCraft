package com.tripcraft.user;

import com.tripcraft.user.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/profile")
    public UserProfileResponse getProfile(
            @AuthenticationPrincipal User user) {

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail()
        );
    }
}