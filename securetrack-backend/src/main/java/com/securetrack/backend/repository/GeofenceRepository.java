package com.securetrack.backend.repository;

import com.securetrack.backend.models.Geofence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeofenceRepository extends JpaRepository<Geofence, Long> {
    List<Geofence> findByDestinationIgnoreCase(String destination);
}
