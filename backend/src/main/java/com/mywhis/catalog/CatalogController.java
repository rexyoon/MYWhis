package com.mywhis.catalog;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 술 종류 / 세부분류 조회 (드롭다운 데이터) */
@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CategoryRepository categoryRepository;
    private final SubtypeRepository subtypeRepository;

    public CatalogController(CategoryRepository categoryRepository, SubtypeRepository subtypeRepository) {
        this.categoryRepository = categoryRepository;
        this.subtypeRepository = subtypeRepository;
    }

    @GetMapping("/categories")
    public List<Category> categories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }

    /** categoryId 가 있으면 해당 종류의 세부분류만, 없으면 전체 */
    @GetMapping("/subtypes")
    public List<Subtype> subtypes(@RequestParam(required = false) String categoryId) {
        return (categoryId == null || categoryId.isBlank())
                ? subtypeRepository.findAllByOrderBySortOrderAsc()
                : subtypeRepository.findByCategoryIdOrderBySortOrderAsc(categoryId);
    }
}