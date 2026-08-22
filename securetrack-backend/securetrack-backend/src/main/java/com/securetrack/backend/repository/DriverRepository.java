package com.securetrack.backend.repository;

import com.securetrack.backend.models.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
