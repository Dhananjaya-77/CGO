package com.securetrack.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * SecureTrack SL
 * IoT-based Real-Time Container Monitoring and Anti-Theft Framework for Sri Lanka Customs.
 *
 * Entry point for the Spring Boot backend. Bootstraps the web server, JPA/MySQL layer,
 * Spring Security + JWT authentication, and the MQTT 5.0 telemetry subscriber.
 */
@SpringBootApplication
@EnableAsync
public class SecureTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureTrackApplication.class, args);
    }
}
