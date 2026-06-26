package com.mywhis.bottle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/** 보틀 요청/응답 DTO 모음 */
public class BottleDtos {

    /** 등록/수정 요청 */
    public record BottleRequest(
            @NotBlank String name,
            String categoryId,
            UUID subtypeId,
            @NotNull @Min(1) Integer totalVolumeMl,
            @NotNull @Min(0) Integer remainingVolumeMl,
            BigDecimal abv,
            @NotNull LocalDate registeredDate,
            LocalDate openedDate,
            String notes
    ) {}

    /** 남은 용량만 수정 */
    public record RemainingRequest(
            @NotNull @Min(0) Integer remainingVolumeMl
    ) {}

    /** 응답 (종류/세부분류 라벨 + 파생값 포함) */
    public record BottleResponse(
            UUID id,
            String name,
            String categoryId,
            String categoryLabel,
            UUID subtypeId,
            String subtypeLabel,
            Integer totalVolumeMl,
            Integer remainingVolumeMl,
            Integer remainingPercent,
            BigDecimal abv,
            LocalDate registeredDate,
            LocalDate openedDate,
            boolean opened,
            Long elapsedDaysSinceRegistered,
            Long elapsedDaysSinceOpened,
            String notes,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {}

    private BottleDtos() {}
}