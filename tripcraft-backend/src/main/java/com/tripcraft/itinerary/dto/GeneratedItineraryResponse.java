package com.tripcraft.itinerary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GeneratedItineraryResponse {

    private List<GeneratedItineraryDay> days;
}