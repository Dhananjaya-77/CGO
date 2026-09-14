package com.securetrack.backend.models;

import jakarta.persistence.*;
import lombok.*;

/**
 * Geofence - a defined corridor/checkpoint used by RouteVerificationService
 * to cross-reference a container's live GPS position against its assigned route.
 */
@Entity
@Table(name = "geofence")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Geofence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "geofence_id")
    private Long geofenceId;

    @Column(nullable = false, length = 150)
    private String destination;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    /** Expected IoT signal strength (dBm) within this corridor - used to flag dead zones/tamper. */
    @Column(name = "signal_strength")
    private Integer signalStrength;

    @Column(name = "start_point", length = 150)
    private String startPoint;

    @Column(name = "end_point", length = 150)
    private String endPoint;
}
