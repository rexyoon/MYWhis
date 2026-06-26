package com.mywhis.bottle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bottles")
@Getter
@Setter
@NoArgsConstructor
public class Bottle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "category_id")
    private String categoryId;

    @Column(name = "subtype_id")
    private UUID subtypeId;

    @Column(name = "total_volume_ml", nullable = false)
    private Integer totalVolumeMl;

    @Column(name = "remaining_volume_ml", nullable = false)
    private Integer remainingVolumeMl;

    private BigDecimal abv;

    @Column(name = "registered_date", nullable = false)
    private LocalDate registeredDate;

    @Column(name = "opened_date")
    private LocalDate openedDate;

    @Column(name = "image_url")
    private String imageUrl;

    private String notes;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}