package com.securetrack.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * AuditLog - records core system events (logins, container operations, user
 * management actions) performed by Staff, for accountability & traceability.
 */
@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @Column(name = "active_time")
    private LocalDateTime activeTime;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(length = 255)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @PrePersist
    protected void onCreate() {
        if (this.activeTime == null) {
            this.activeTime = LocalDateTime.now();
        }
    }
}
