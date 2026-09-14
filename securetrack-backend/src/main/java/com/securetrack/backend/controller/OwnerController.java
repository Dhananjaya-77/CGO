package com.securetrack.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/owner")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerController {

    // 1. Owner ta adala active containers list eka
    @GetMapping("/containers")
    public ResponseEntity<List<Map<String, Object>>> getOwnerContainers() {
        List<Map<String, Object>> containers = new ArrayList<>();

        Map<String, Object> c1 = new HashMap<>();
        c1.put("containerId", "CONT-1001");
        c1.put("origin", "Colombo Port (CICT)");
        c1.put("destination", "Biyagama BOI Zone");
        c1.put("status", "IN_TRANSIT");
        c1.put("sealStatus", "LOCKED_INTACT");
        c1.put("driverName", "Sunil Shantha");
        c1.put("vehicleNo", "WP-CAD-4589");
        c1.put("eta", "45 Mins");
        containers.add(c1);

        Map<String, Object> c2 = new HashMap<>();
        c2.put("containerId", "CONT-1002");
        c2.put("origin", "Hambantota Port");
        c2.put("destination", "Katunayake FTZ");
        c2.put("status", "CUSTOMS_CLEARED");
        c2.put("sealStatus", "LOCKED_INTACT");
        c2.put("driverName", "Kamal Perera");
        c2.put("vehicleNo", "WP-GB-1120");
        c2.put("eta", "3 Hours");
        containers.add(c2);

        return ResponseEntity.ok(containers);
    }

    // 2. Container eke live telemetry data
    @GetMapping("/track/{containerId}")
    public ResponseEntity<Map<String, Object>> getContainerTracking(@PathVariable String containerId) {
        Map<String, Object> tracking = new HashMap<>();
        tracking.put("containerId", containerId);
        tracking.put("currentLat", 6.9319);
        tracking.put("currentLng", 79.8478);
        tracking.put("speed", "42 km/h");
        tracking.put("temperature", "24.5 °C");
        tracking.put("sealIntact", true);
        tracking.put("lastPing", "10 seconds ago via MQTT 5.0");
        tracking.put("status", "IN_TRANSIT");
        tracking.put("origin", "Colombo Port (CICT)");
        tracking.put("destination", "Biyagama BOI Zone");

        // Route milestones
        List<Map<String, Object>> milestones = new ArrayList<>();
        milestones.add(Map.of("stage", "Port Gate Clearance", "time", "08:30 AM", "completed", true));
        milestones.add(Map.of("stage", "Customs Inspection & Seal Armed", "time", "09:15 AM", "completed", true));
        milestones.add(Map.of("stage", "In Transit (Main Highway)", "time", "10:00 AM", "completed", true));
        milestones.add(Map.of("stage", "Destination Gate Arrival", "time", "Estimated 11:15 AM", "completed", false));
        
        tracking.put("milestones", milestones);
        return ResponseEntity.ok(tracking);
    }

    // 3. Owner Notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<Map<String, Object>>> getOwnerNotifications() {
        List<Map<String, Object>> notifications = new ArrayList<>();
        notifications.add(Map.of(
                "id", 1,
                "title", "Customs Seal Armed",
                "message", "E-Seal on CONT-1001 was successfully locked at Colombo Port CICT gate.",
                "time", "09:15 AM",
                "type", "SUCCESS"
        ));
        notifications.add(Map.of(
                "id", 2,
                "title", "Route Clearance Passed",
                "message", "CONT-1001 crossed Kelaniya Geofence corridor without deviations.",
                "time", "10:05 AM",
                "type", "INFO"
        ));
        return ResponseEntity.ok(notifications);
    }
}