package com.securetrack.backend.service;

import com.securetrack.backend.dto.TelemetryPayload;
import com.securetrack.backend.models.*;
import com.securetrack.backend.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * SecurityMonitoringService - implements Dual-Sensor Tamper Verification.
 *
 * A Container's seal is only considered breached when BOTH the magnetic reed
 * switch (door/seal opened) AND the ambient light sensor (light detected
 * inside the container) agree - this dual-condition check filters out false
 * positives caused by a single faulty/noisy sensor, and raises a
 * high-priority Alert only on genuine tamper events.
 */
@Service
@RequiredArgsConstructor
public class SecurityMonitoringService {

    private static final Logger log = LoggerFactory.getLogger(SecurityMonitoringService.class);

    private final AlertRepository alertRepository;
    private final AlertNotificationService alertNotificationService;

    /**
     * Evaluates the latest sensor readings from an IoT module against the
     * Container it is attached to, and raises an Alert when tamper is confirmed.
     */
    public void evaluateTamper(Container container, IoTModule module, TelemetryPayload payload) {
        boolean magnetSensorActive = Boolean.TRUE.equals(payload.getMagnetSensorActive()); // seal intact/closed
        boolean lightSensorActive = Boolean.TRUE.equals(payload.getLightSensorActive());   // light detected inside

        // Dual-Sensor Tamper Verification:
        // Seal broken (magnet sensor reports open) AND light detected inside => confirmed tamper.
        boolean sealBreached = !magnetSensorActive;
        boolean tamperConfirmed = sealBreached && lightSensorActive;

        if (tamperConfirmed) {
            raiseAlert(container, payload, AlertType.TAMPER_DETECTED, AlertSeverity.CRITICAL,
                    "Dual-sensor tamper confirmed: seal opened and light detected inside container "
                            + container.getContainerCode());
        } else if (sealBreached) {
            // Single-sensor trigger only - log as a lower severity advisory, not a confirmed breach.
            raiseAlert(container, payload, AlertType.SEAL_BROKEN, AlertSeverity.MEDIUM,
                    "Seal/magnet sensor reports open state on container " + container.getContainerCode()
                            + " (awaiting light-sensor confirmation)");
        }

        checkBatteryLevel(container, module);
    }

    private void checkBatteryLevel(Container container, IoTModule module) {
        if (module.getBatteryLevel() != null && module.getBatteryLevel() <= 15) {
            Alert alert = Alert.builder()
                    .container(container)
                    .type(AlertType.LOW_BATTERY)
                    .severity(AlertSeverity.LOW)
                    .message("IoT module battery low (" + module.getBatteryLevel() + "%) on container "
                            + container.getContainerCode())
                    .status(AlertStatus.PENDING)
                    .build();
            Alert saved = alertRepository.save(alert);
            alertNotificationService.notify(saved);
        }
    }

    private void raiseAlert(Container container, TelemetryPayload payload, AlertType type,
                             AlertSeverity severity, String message) {
        String gps = (payload.getLatitude() != null && payload.getLongitude() != null)
                ? payload.getLatitude() + "," + payload.getLongitude()
                : null;

        Alert alert = Alert.builder()
                .container(container)
                .gpsLocation(gps)
                .message(message)
                .type(type)
                .severity(severity)
                .status(AlertStatus.PENDING)
                .build();

        Alert saved = alertRepository.save(alert);
        log.warn("Security alert raised: {}", message);
        alertNotificationService.notify(saved);
    }
}
