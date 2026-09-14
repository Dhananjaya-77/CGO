package com.securetrack.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securetrack.backend.dto.AlertResponse;
import com.securetrack.backend.exception.ResourceNotFoundException;
import com.securetrack.backend.models.Alert;
import com.securetrack.backend.models.AlertStatus;
import com.securetrack.backend.repository.AlertRepository;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertRepository alertRepository;

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(alertRepository.findAllByOrderBySentAtDesc().stream()
                .map(this::toResponse).toList());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(alertRepository.findByStatusOrderBySentAtDesc(AlertStatus.PENDING).stream()
                .map(this::toResponse).toList());
    }

    @GetMapping("/container/{containerId}")
    public ResponseEntity<List<AlertResponse>> getAlertsForContainer(@PathVariable Long containerId) {
        return ResponseEntity.ok(alertRepository.findByContainer_ContainerIdOrderBySentAtDesc(containerId).stream()
                .map(this::toResponse).toList());
    }

    @PutMapping("/{alertId}/acknowledge")
    public ResponseEntity<AlertResponse> acknowledgeAlert(@PathVariable Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));
        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        return ResponseEntity.ok(toResponse(alertRepository.save(alert)));
    }

    @PutMapping("/{alertId}/resolve")
    public ResponseEntity<AlertResponse> resolveAlert(@PathVariable Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));
        alert.setStatus(AlertStatus.RESOLVED);
        return ResponseEntity.ok(toResponse(alertRepository.save(alert)));
    }

    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .alertId(alert.getAlertId())
                .containerId(alert.getContainer() != null ? alert.getContainer().getContainerId() : null)
                .containerCode(alert.getContainer() != null ? alert.getContainer().getContainerCode() : null)
                .gpsLocation(alert.getGpsLocation())
                .message(alert.getMessage())
                .type(alert.getType())
                .severity(alert.getSeverity())
                .status(alert.getStatus())
                .sentAt(alert.getSentAt())
                .build();
    }
}
