package com.securetrack.backend.repository;

import com.securetrack.backend.models.IoTModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IoTModuleRepository extends JpaRepository<IoTModule, Long> {
    Optional<IoTModule> findByDeviceUid(String deviceUid);
}
