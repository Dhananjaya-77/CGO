package com.securetrack.backend.repository;

import com.securetrack.backend.models.Alert;
import com.securetrack.backend.models.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStatusOrderBySentAtDesc(AlertStatus status);
    List<Alert> findByContainer_ContainerIdOrderBySentAtDesc(Long containerId);
    List<Alert> findAllByOrderBySentAtDesc();
}
