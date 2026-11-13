package com.tripcraft.trip;

import com.tripcraft.trip.dto.CreateTripRequest;
import com.tripcraft.trip.dto.TripResponse;
import com.tripcraft.trip.service.TripService;
import com.tripcraft.user.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    // Create a new trip
    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal User user) {

        TripResponse response = tripService.createTrip(request, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all trips of the logged-in user
    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips(
            @AuthenticationPrincipal User user) {

        List<TripResponse> trips = tripService.getMyTrips(user);

        return ResponseEntity.ok(trips);
    }

    // Get a specific trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        TripResponse response = tripService.getTripById(id, user);

        return ResponseEntity.ok(response);
    }

    // Update an existing trip
    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal User user) {

        TripResponse response = tripService.updateTrip(id, request, user);

        return ResponseEntity.ok(response);
    }

    // Delete a trip
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        tripService.deleteTrip(id, user);

        return ResponseEntity.noContent().build();
    }
}