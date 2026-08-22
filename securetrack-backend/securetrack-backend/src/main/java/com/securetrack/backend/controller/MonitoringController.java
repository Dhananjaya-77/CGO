package com.securetrack.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/monitoring")
@CrossOrigin(origins = "http://localhost:3000")
public class MonitoringController {

    // ආරම්භක ඛණ්ඩාංක (කොළඹ අවට)
    private double currentLat = 6.9497;
    private double currentLon = 79.8433;

    @GetMapping("/live-locations")
    public List<Map<String, Object>> getLiveLocations() {
        List<Map<String, Object>> activeContainers = new ArrayList<>();

        // හැම පාරම React එකෙන් දත්ත ඉල්ලද්දී ඛණ්ඩාංක ටිකක් වෙනස් කරනවා
        currentLat -= 0.0005; // පහළට යනවා
        currentLon += 0.0005; // දකුණට යනවා

        Map<String, Object> container1 = new HashMap<>();
        container1.put("containerId", "CONT-LK-001");
        container1.put("latitude", currentLat);
        container1.put("longitude", currentLon);
        container1.put("status", "IN_TRANSIT");
        container1.put("speed", 45.5);
        container1.put("deviceId", "IoT-ESP-001");

        activeContainers.add(container1);
        return activeContainers;
    }
}