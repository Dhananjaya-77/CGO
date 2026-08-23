
package com.example.demo.model;

import jakarta.persistence.*;
        import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String containerId;

    @Column(nullable = false, unique = true)
    private String deviceId;

    private String origin;
    private String destination;

    private String sealStatus;       // LOCKED, UNLOCKED
    private String shipmentStatus;   // ACTIVE, COMPLETED
    private String unlockCode;       // Passcode

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
