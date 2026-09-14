package com.securetrack.backend.repository;

import com.securetrack.backend.models.TrackingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingLogRepository extends JpaRepository<TrackingLog, Long> {
    List<TrackingLog> findByContainer_ContainerIdOrderByStartTimeDesc(Long containerId);
}
