package com.tripcraft.itinerary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class GeneratedItineraryDay {

    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String activities;
}