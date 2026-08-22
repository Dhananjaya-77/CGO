package com.securetrack.backend.repository;

import com.securetrack.backend.models.Inspector;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InspectorRepository extends JpaRepository<Inspector, Long> {
}
