package com.securetrack.backend.service;

import com.securetrack.backend.models.Alert;
import com.securetrack.backend.models.AlertSeverity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * AlertNotificationService - responsible for pushing security-exception
 * notifications to Inspectors/Officers monitoring the "Monitor Real-Time
 * Security Alerts" dashboard.
 *
 * This is intentionally decoupled from the transport mechanism: in this MVP
 * it logs + is ready to be wired to WebSocket/STOMP broadcast, Firebase Cloud
 * Messaging, SMS gateway, or email, without changing calling services.
 */
@Service
public class AlertNotificationService {

    private static final Logger log = LoggerFactory.getLogger(AlertNotificationService.class);

    @Async
    public void notify(Alert alert) {
        if (alert.getSeverity() == AlertSeverity.HIGH || alert.getSeverity() == AlertSeverity.CRITICAL) {
            dispatchHighPriority(alert);
        } else {
            dispatchStandard(alert);
        }
    }

    private void dispatchHighPriority(Alert alert) {
        // TODO: integrate real-time push (WebSocket/FCM/SMS) for on-duty Inspectors.
        log.warn("[HIGH-PRIORITY ALERT] container={} type={} message='{}' location={}",
                alert.getContainer() != null ? alert.getContainer().getContainerCode() : "N/A",
                alert.getType(), alert.getMessage(), alert.getGpsLocation());
    }

    private void dispatchStandard(Alert alert) {
        log.info("[ALERT] container={} type={} message='{}'",
                alert.getContainer() != null ? alert.getContainer().getContainerCode() : "N/A",
                alert.getType(), alert.getMessage());
    }
}
