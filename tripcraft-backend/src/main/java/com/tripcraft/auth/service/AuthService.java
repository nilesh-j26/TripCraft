
package com.tripcraft.auth.service;

import com.tripcraft.auth.DuplicateUserException;
import com.tripcraft.auth.InvalidCredentialsException;
import com.tripcraft.auth.dto.LoginRequest;
import com.tripcraft.auth.dto.LoginResponse;
import com.tripcraft.auth.dto.RegisterRequest;
import com.tripcraft.auth.dto.RegisterResponse;
import com.tripcraft.user.Role;
import com.tripcraft.user.User;
import com.tripcraft.user.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("Email is already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException("Username is already taken");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                "Registration successful"
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        // Find user using email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password")
                );

        // Verify raw password against stored BCrypt password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                86400,
                "Login successful"
        );
    }
}
