package org.example.back.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.example.back.domain.Article;
import org.example.back.domain.Facture;
import org.example.back.domain.enums.StatutFacture;
import org.example.back.repository.ArticleRepository;
import org.example.back.repository.FactureRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/factures")
@Transactional
@Slf4j
@AllArgsConstructor
@Builder
public class FactureResource {
    private final FactureRepository factureRepository;


    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures() {
        List<Facture> factures = factureRepository.findAll();
        return ResponseEntity.ok().body(factures);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFacture(@PathVariable Long id) {
        Optional<Facture> facture = factureRepository.findById(id);
        return facture.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Facture> createFacture(@RequestBody Facture facture) throws URISyntaxException {
        if (facture.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        Facture result = factureRepository.save(facture);
        return ResponseEntity.created(new URI("/api/factures/" + result.getId()))
                .body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> updateFacture(@PathVariable Long id, @RequestBody Facture facture) {
        if (facture.getId() == null || !facture.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }

        if (!factureRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Facture result = factureRepository.save(facture);
        return ResponseEntity.ok().body(result);
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Facture> updateStatutFacture(
            @PathVariable Long id,
            @RequestBody StatutFacture statut) {

        return factureRepository.findById(id)
                .map(facture -> {
                    facture.setStatut(statut);
                    Facture updated = factureRepository.save(facture);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        if (!factureRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        factureRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Facture>> getFacturesByClient(@PathVariable Long clientId) {
        List<Facture> factures = factureRepository.findAllByClientId(clientId);
        return ResponseEntity.ok().body(factures);
    }
}
