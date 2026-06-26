package com.mywhis.bottle;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BottleRepository extends JpaRepository<Bottle, UUID> {
    List<Bottle> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Bottle> findByidAndUserId(UUID id, UUID userId);
}
