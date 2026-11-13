package com.tripcraft.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initDefaultAdmin() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User user = new User();
                user.setUsername("admin");
                user.setName("Administrator");
                user.setPassword(passwordEncoder.encode("securePassword123"));
                user.setEmail("admin@tripcraft.com");
                user.setRole(Role.ADMIN);
                userRepository.save(user);
                System.out.println("Default admin user created via UserService!");
            }
        };
    }
}