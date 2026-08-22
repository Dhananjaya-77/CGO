package com.securetrack.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.securetrack.backend.models.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    // Spring Boot එකට තේරෙන්න 'Container' එකේ 'ContainerId' එකෙන් හොයන්න කියලා හරියටම දුන්නා
    List<Trip> findByContainer_ContainerIdOrderByIdDesc(Long containerId);
}