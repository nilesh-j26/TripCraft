package com.tripcraft.itinerary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ItineraryDayResponse {

    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String activities;
}
