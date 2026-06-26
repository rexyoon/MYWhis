package com.mywhis.catalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "subtypes")
@Getter
@Setter
@NoArgsConstructor
public class Subtype {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "category_id", nullable = false)
    private String categoryId;
    @Column(name = "label_ko", nullable = false)
    private String labelKo;
    @Column(name = "sort_order")
    private int sortOrder;
}
