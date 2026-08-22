package com.securetrack.backend.repository;

import com.securetrack.backend.models.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
