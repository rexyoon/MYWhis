package com.mywhis.bottle;

import com.mywhis.bottle.dto.BottleDtos.BottleRequest;
import com.mywhis.bottle.dto.BottleDtos.BottleResponse;
import com.mywhis.catalog.CategoryRepository;
import com.mywhis.catalog.SubtypeRepository;
import com.mywhis.common.NotFoundException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BottleService {

    private final BottleRepository bottleRepository;
    private final CategoryRepository categoryRepository;
    private final SubtypeRepository subtypeRepository;

    public BottleService(
            BottleRepository bottleRepository,
            CategoryRepository categoryRepository,
            SubtypeRepository subtypeRepository
    ) {
        this.bottleRepository = bottleRepository;
        this.categoryRepository = categoryRepository;
        this.subtypeRepository = subtypeRepository;
    }

    @Transactional(readOnly = true)
    public List<BottleResponse> list(UUID userId) {
        return bottleRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BottleResponse get(UUID userId, UUID id) {
        return toResponse(findOwned(userId, id));
    }

    @Transactional
    public BottleResponse create(UUID userId, BottleRequest req) {
        validateVolumes(req.totalVolumeMl(), req.remainingVolumeMl());
        Bottle b = new Bottle();
        b.setUserId(userId);
        apply(b, req);
        return toResponse(bottleRepository.save(b));
    }

    @Transactional
    public BottleResponse update(UUID userId, UUID id, BottleRequest req) {
        validateVolumes(req.totalVolumeMl(), req.remainingVolumeMl());
        Bottle b = findOwned(userId, id);
        apply(b, req);
        return toResponse(bottleRepository.save(b));
    }

    @Transactional
    public BottleResponse updateRemaining(UUID userId, UUID id, int remaining) {
        Bottle b = findOwned(userId, id);
        validateVolumes(b.getTotalVolumeMl(), remaining);
        b.setRemainingVolumeMl(remaining);
        return toResponse(bottleRepository.save(b));
    }

    @Transactional
    public void delete(UUID userId, UUID id) {
        Bottle b = findOwned(userId, id);
        bottleRepository.delete(b);
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────

    private Bottle findOwned(UUID userId, UUID id) {
        return bottleRepository.findByidAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("보틀을 찾을 수 없습니다: " + id));
    }

    private void validateVolumes(Integer total, Integer remaining) {
        if (total == null || total <= 0) {
            throw new IllegalArgumentException("총 용량은 1 이상이어야 합니다.");
        }
        if (remaining == null || remaining < 0) {
            throw new IllegalArgumentException("남은 용량은 0 이상이어야 합니다.");
        }
        if (remaining > total) {
            throw new IllegalArgumentException("남은 용량이 총 용량보다 클 수 없습니다.");
        }
    }

    private void apply(Bottle b, BottleRequest req) {
        b.setName(req.name().trim());
        b.setCategoryId(req.categoryId());
        b.setSubtypeId(req.subtypeId());
        b.setTotalVolumeMl(req.totalVolumeMl());
        b.setRemainingVolumeMl(req.remainingVolumeMl());
        b.setAbv(req.abv());
        b.setRegisteredDate(req.registeredDate());
        b.setOpenedDate(req.openedDate());
        b.setNotes(req.notes() != null && !req.notes().isBlank() ? req.notes().trim() : null);
    }

    private BottleResponse toResponse(Bottle b) {
        String categoryLabel = b.getCategoryId() == null ? null :
                categoryRepository.findById(b.getCategoryId()).map(c -> c.getLabelKo()).orElse(null);
        String subtypeLabel = b.getSubtypeId() == null ? null :
                subtypeRepository.findById(b.getSubtypeId()).map(s -> s.getLabelKo()).orElse(null);

        int percent = b.getTotalVolumeMl() == 0 ? 0 :
                Math.round((float) b.getRemainingVolumeMl() / b.getTotalVolumeMl() * 100);

        LocalDate today = LocalDate.now();
        Long sinceReg = ChronoUnit.DAYS.between(b.getRegisteredDate(), today);
        Long sinceOpen = b.getOpenedDate() == null ? null :
                ChronoUnit.DAYS.between(b.getOpenedDate(), today);

        return new BottleResponse(
                b.getId(),
                b.getName(),
                b.getCategoryId(),
                categoryLabel,
                b.getSubtypeId(),
                subtypeLabel,
                b.getTotalVolumeMl(),
                b.getRemainingVolumeMl(),
                percent,
                b.getAbv(),
                b.getRegisteredDate(),
                b.getOpenedDate(),
                b.getOpenedDate() != null,
                sinceReg,
                sinceOpen,
                b.getNotes(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }
}