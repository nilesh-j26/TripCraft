
package com.tripcraft.trip.service;

import com.tripcraft.trip.Trip;
import com.tripcraft.trip.TripRepository;
import com.tripcraft.trip.dto.CreateTripRequest;
import com.tripcraft.trip.dto.TripResponse;
import com.tripcraft.user.User;

import com.tripcraft.itinerary.Itinerary;
import com.tripcraft.itinerary.ItineraryRepository;
import com.tripcraft.itinerary.ItineraryDay;
import com.tripcraft.itinerary.ItineraryDayRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final ItineraryDayRepository itineraryDayRepository;

    // Create a new trip
    @Transactional
    public TripResponse createTrip(CreateTripRequest request, User user) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be before start date"
            );
        }

        Trip trip = new Trip();

        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        trip.setNumberOfTravelers(request.getNumberOfTravelers());

        trip.setUser(user);

        Trip savedTrip = tripRepository.save(trip);

        return convertToResponse(savedTrip);
    }

    // Get all trips belonging to the logged-in user
    @Transactional(readOnly = true)
    public List<TripResponse> getMyTrips(User user) {

        List<Trip> trips = tripRepository.findByUserId(user.getId());

        return trips.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Convert Trip entity into TripResponse DTO
    private TripResponse convertToResponse(Trip trip) {

        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getBudget(),
                trip.getNumberOfTravelers(),
                trip.getCreatedAt()
        );
    }

    // Get a specific trip belonging to the logged-in user
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long tripId, User user) {

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trip not found"
                ));

        return convertToResponse(trip);
    }

    // Update an existing trip
    @Transactional
    public TripResponse updateTrip(
            Long tripId,
            CreateTripRequest request,
            User user) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be before start date"
            );
        }

        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trip not found"
                ));

        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        trip.setNumberOfTravelers(request.getNumberOfTravelers());

        Trip updatedTrip = tripRepository.save(trip);

        return convertToResponse(updatedTrip);
    }

    // Delete a trip and its dependent itinerary records
    @Transactional
    public void deleteTrip(Long tripId, User user) {

        // Verify that the trip belongs to the logged-in user
        Trip trip = tripRepository
                .findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trip not found"
                ));

        // Find the itinerary associated with this trip
        itineraryRepository.findByTripId(tripId).ifPresent(itinerary -> {

            // Find all days belonging to this itinerary
            List<ItineraryDay> days =
                    itineraryDayRepository
                            .findByItineraryIdOrderByDayNumberAsc(
                                    itinerary.getId()
                            );

            // Delete itinerary days first
            itineraryDayRepository.deleteAll(days);
            itineraryDayRepository.flush();

            // Delete the itinerary next
            itineraryRepository.delete(itinerary);
            itineraryRepository.flush();
        });

        // Delete the trip last
        tripRepository.delete(trip);
    }
}
