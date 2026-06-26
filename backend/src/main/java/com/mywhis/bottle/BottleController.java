package com.mywhis.bottle;

import com.mywhis.bottle.dto.BottleDtos.BottleRequest;
import com.mywhis.bottle.dto.BottleDtos.BottleResponse;
import com.mywhis.bottle.dto.BottleDtos.RemainingRequest;
import com.mywhis.security.CurrentUser;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 내 보틀 CRUD (모두 인증 필요, 본인 데이터로 스코프) */
@RestController
@RequestMapping("/api/bottles")
public class BottleController {

    private final BottleService bottleService;

    public BottleController(BottleService bottleService) {
        this.bottleService = bottleService;
    }

    @GetMapping
    public List<BottleResponse> list() {
        return bottleService.list(CurrentUser.id());
    }

    @GetMapping("/{id}")
    public BottleResponse get(@PathVariable UUID id) {
        return bottleService.get(CurrentUser.id(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BottleResponse create(@Valid @RequestBody BottleRequest request) {
        return bottleService.create(CurrentUser.id(), request);
    }

    @PutMapping("/{id}")
    public BottleResponse update(@PathVariable UUID id, @Valid @RequestBody BottleRequest request) {
        return bottleService.update(CurrentUser.id(), id, request);
    }

    @PatchMapping("/{id}/remaining")
    public BottleResponse updateRemaining(@PathVariable UUID id, @Valid @RequestBody RemainingRequest request) {
        return bottleService.updateRemaining(CurrentUser.id(), id, request.remainingVolumeMl());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        bottleService.delete(CurrentUser.id(), id);
    }
}