package com.securetrack.backend.repository;

import com.securetrack.backend.models.Container;
import com.securetrack.backend.models.ContainerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContainerRepository extends JpaRepository<Container, Long> {
    Optional<Container> findByContainerCode(String containerCode);
    Optional<Container> findByIotModule_ModuleId(Long moduleId);
    Optional<Container> findByIotModule_DeviceUid(String deviceUid);
    List<Container> findByStatus(ContainerStatus status);
    List<Container> findByOwner_OwnerId(Long ownerId);
    List<Container> findByDriver_DriverId(Long driverId);
}
