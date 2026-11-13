package com.tripcraft.itinerary;

import com.tripcraft.itinerary.dto.ItineraryResponse;
import com.tripcraft.itinerary.service.ItineraryService;
import com.tripcraft.user.User;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/{tripId}/itinerary/generate")
    public ResponseEntity<ItineraryResponse> generateItinerary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal User user) {

        ItineraryResponse response =
                itineraryService.generateItinerary(tripId, user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{tripId}/itinerary")
    public ResponseEntity<ItineraryResponse> getItinerary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal User user) {

        ItineraryResponse response =
                itineraryService.getItinerary(tripId, user);

        return ResponseEntity.ok(response);
    }
}