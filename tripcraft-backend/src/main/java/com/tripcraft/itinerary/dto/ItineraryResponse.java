
package com.tripcraft.itinerary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ItineraryResponse {

    private Long id;
    private Long tripId;
    private String destination;
    private LocalDateTime createdAt;
    private List<ItineraryDayResponse> days;
}
