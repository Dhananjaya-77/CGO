package com.securetrack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JSON payload structure published by an ESP32 edge device over MQTT, e.g.:
 * {
 *   "deviceUid": "ESP32-CT-001",
 *   "latitude": 6.9271,
 *   "longitude": 79.8612,
 *   "batteryLevel": 87,
 *   "lightSensorActive": false,
 *   "magnetSensorActive": true,
 *   "timestamp": "2025-06-01T10:15:30"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryPayload {
    private String deviceUid;
    private Double latitude;
    private Double longitude;
    private Integer batteryLevel;
    private Boolean lightSensorActive;
    private Boolean magnetSensorActive;
    private String timestamp;
}
