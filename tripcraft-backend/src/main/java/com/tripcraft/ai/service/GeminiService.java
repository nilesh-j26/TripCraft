
package com.tripcraft.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.ObjectMapper;
import com.tripcraft.itinerary.dto.GeneratedItineraryResponse;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestClient geminiRestClient;
    private final String model;
    private final ObjectMapper objectMapper;

    public GeminiService(
            RestClient geminiRestClient,
            ObjectMapper objectMapper,
            @Value("${app.gemini.model}") String model) {

        this.geminiRestClient = geminiRestClient;
        this.objectMapper = objectMapper;
        this.model = model;
    }

    public String generateContent(String prompt) {

        Map<String, Object> request = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "thinkingConfig", Map.of(
                                "thinkingLevel", "low"
                        )
                )
        );

        // Retry up to 3 total attempts for temporary 503 errors
        for (int attempt = 1; attempt <= 3; attempt++) {

            try {

                Map<?, ?> response = geminiRestClient.post()
                        .uri("/v1beta/models/{model}:generateContent", model)
                        .body(request)
                        .retrieve()
                        .body(Map.class);

                if (response == null) {
                    throw new IllegalStateException(
                            "Gemini returned an empty response"
                    );
                }

                Object candidatesObject = response.get("candidates");

                if (!(candidatesObject instanceof List<?> candidates)
                        || candidates.isEmpty()) {
                    throw new IllegalStateException(
                            "Gemini did not return any candidates"
                    );
                }

                Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                List<?> parts = (List<?>) content.get("parts");

                for (Object partObject : parts) {
                    Map<?, ?> part = (Map<?, ?>) partObject;

                    if (part.get("text") instanceof String text) {
                        return text;
                    }
                }

                throw new IllegalStateException(
                        "Gemini response did not contain text"
                );

            } catch (HttpServerErrorException.ServiceUnavailable ex) {

                if (attempt == 3) {
                    throw new ResponseStatusException(
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "Gemini is temporarily busy. Please try again in a minute.",
                            ex
                    );
                }

                try {
                    Thread.sleep(1000L * attempt);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();

                    throw new IllegalStateException(
                            "Gemini retry was interrupted",
                            interruptedException
                    );
                }
            }
        }

        throw new IllegalStateException(
                "Unable to generate content from Gemini"
        );
    }

    public GeneratedItineraryResponse generateItinerary(String prompt) {

        // API errors are allowed to propagate separately
        String jsonResponse = generateContent(prompt);

        try {
            return objectMapper.readValue(
                    jsonResponse,
                    GeneratedItineraryResponse.class
            );

        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Gemini returned invalid itinerary JSON",
                    ex
            );
        }
    }
}
