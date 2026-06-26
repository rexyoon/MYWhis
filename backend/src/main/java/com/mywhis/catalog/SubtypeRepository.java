package com.mywhis.catalog;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubtypeRepository extends JpaRepository<Subtype, UUID> {
    List<Subtype> findAllByOrderBySortOrderAsc();
    List<Subtype> findByCategoryIdOrderBySortOrderAsc(String categoryId);
}