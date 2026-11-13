
package com.tripcraft.ai.controller;

import com.tripcraft.ai.dto.GeminiTestRequest;
import com.tripcraft.ai.service.GeminiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class GeminiTestController {

    private final GeminiService geminiService;

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testGemini(
            @Valid @RequestBody GeminiTestRequest request) {

        String response = geminiService.generateContent(
                request.getPrompt()
        );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }
}
