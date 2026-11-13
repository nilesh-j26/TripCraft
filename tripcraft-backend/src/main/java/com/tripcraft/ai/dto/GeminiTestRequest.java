
package com.tripcraft.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GeminiTestRequest {

    @NotBlank(message = "Prompt is required")
    private String prompt;
}
