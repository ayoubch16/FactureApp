package org.example.back.repository;

import org.example.back.domain.Bl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlRepository extends JpaRepository<Bl, Long> {
}