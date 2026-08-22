package com.securetrack.backend.repository;

import com.securetrack.backend.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByStaff_StaffIdOrderByActiveTimeDesc(Long staffId);
    List<AuditLog> findAllByOrderByActiveTimeDesc();
}
