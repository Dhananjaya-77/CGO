package com.securetrack.backend.repository;

import com.securetrack.backend.models.CustomOfficer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomOfficerRepository extends JpaRepository<CustomOfficer, Long> {
}
