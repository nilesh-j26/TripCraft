
package com.tripcraft.itinerary.service;

import com.tripcraft.ai.service.GeminiService;
import com.tripcraft.itinerary.Itinerary;
import com.tripcraft.itinerary.ItineraryDay;
import com.tripcraft.itinerary.ItineraryDayRepository;
import com.tripcraft.itinerary.ItineraryRepository;
import com.tripcraft.itinerary.dto.GeneratedItineraryDay;
import com.tripcraft.itinerary.dto.GeneratedItineraryResponse;
import com.tripcraft.itinerary.dto.ItineraryDayResponse;
import com.tripcraft.itinerary.dto.ItineraryResponse;
import com.tripcraft.trip.Trip;
import com.tripcraft.trip.TripRepository;
import com.tripcraft.user.User;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final GeminiService geminiService;
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final ItineraryDayRepository itineraryDayRepository;

    @Transactional
    public ItineraryResponse generateItinerary(Long tripId, User user) {

        Trip trip = tripRepository.findByIdAndUserId(
                tripId,
                user.getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Trip not found"
        ));

        long totalDays = ChronoUnit.DAYS.between(
                trip.getStartDate(),
                trip.getEndDate()
        ) + 1;

        String prompt = buildPrompt(trip, totalDays);

        GeneratedItineraryResponse generated =
                geminiService.generateItinerary(prompt);

        if (generated.getDays() == null
                || generated.getDays().size() != totalDays) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini returned an invalid number of itinerary days"
            );
        }

        Itinerary itinerary = itineraryRepository
                .findByTripId(tripId)
                .orElseGet(() -> {
                    Itinerary newItinerary = new Itinerary();
                    newItinerary.setTrip(trip);
                    return itineraryRepository.save(newItinerary);
                });

        List<ItineraryDay> oldDays =
                itineraryDayRepository
                        .findByItineraryIdOrderByDayNumberAsc(
                                itinerary.getId()
                        );

        itineraryDayRepository.deleteAll(oldDays);

        List<ItineraryDay> newDays = new ArrayList<>();

        for (int i = 0; i < generated.getDays().size(); i++) {

            GeneratedItineraryDay generatedDay =
                    generated.getDays().get(i);

            ItineraryDay day = new ItineraryDay();

            day.setItinerary(itinerary);
            day.setDayNumber(i + 1);
            day.setDate(trip.getStartDate().plusDays(i));
            day.setTitle(generatedDay.getTitle());
            day.setActivities(generatedDay.getActivities());

            newDays.add(day);
        }

        List<ItineraryDay> savedDays =
                itineraryDayRepository.saveAll(newDays);

        List<ItineraryDayResponse> dayResponses =
                savedDays.stream()
                        .map(day -> new ItineraryDayResponse(
                                day.getId(),
                                day.getDayNumber(),
                                day.getDate(),
                                day.getTitle(),
                                day.getActivities()
                        ))
                        .toList();

        return new ItineraryResponse(
                itinerary.getId(),
                trip.getId(),
                trip.getDestination(),
                itinerary.getCreatedAt(),
                dayResponses
        );
    }

    private String buildPrompt(Trip trip, long totalDays) {

        LocalDate startDate = trip.getStartDate();
        LocalDate endDate = trip.getEndDate();

        return """
                Create a detailed travel itinerary using these details:

                Trip title: %s
                Destination: %s
                Start date: %s
                End date: %s
                Number of days: %d
                Budget: %s
                Number of travelers: %d

                Requirements:
                1. Generate exactly %d days.
                2. Include activities suitable for each day.
                3. Consider the given budget and number of travelers.
                4. Use the exact dates from the start date to the end date.
                5. Return only valid JSON.
                6. Do not include Markdown or explanations.

                Use this exact JSON structure:
                {
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "YYYY-MM-DD",
                      "title": "Day title",
                      "activities": "Activity 1; Activity 2; Activity 3"
                    }
                  ]
                }
                """.formatted(
                trip.getTitle(),
                trip.getDestination(),
                startDate,
                endDate,
                totalDays,
                trip.getBudget(),
                trip.getNumberOfTravelers(),
                totalDays
        );
    }

    @Transactional(readOnly = true)
    public ItineraryResponse getItinerary(Long tripId, User user) {

        Trip trip = tripRepository.findByIdAndUserId(
                tripId,
                user.getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Trip not found"
        ));

        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Itinerary not found"
                ));

        List<ItineraryDayResponse> dayResponses =
                itineraryDayRepository
                        .findByItineraryIdOrderByDayNumberAsc(itinerary.getId())
                        .stream()
                        .map(day -> new ItineraryDayResponse(
                                day.getId(),
                                day.getDayNumber(),
                                day.getDate(),
                                day.getTitle(),
                                day.getActivities()
                        ))
                        .toList();

        return new ItineraryResponse(
                itinerary.getId(),
                trip.getId(),
                trip.getDestination(),
                itinerary.getCreatedAt(),
                dayResponses
        );
    }
}
