package com.securetrack.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securetrack.backend.models.Container;
import com.securetrack.backend.models.Trip;
import com.securetrack.backend.repository.ContainerRepository;
import com.securetrack.backend.repository.TripRepository;
import com.securetrack.backend.service.TripAssignmentService;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    @Autowired
    private TripAssignmentService tripAssignmentService;

    @Autowired
    private ContainerRepository containerRepository; 

    // Database එකෙන් Trip දත්ත ගන්න මේක අලුතින් Autowire කළා
    @Autowired
    private TripRepository tripRepository;

    @PostMapping("/assign")
    public ResponseEntity<?> assignTrip(@RequestBody Map<String, Object> payload) {
        try {
            Long containerId = Long.parseLong(payload.get("containerId").toString());
            double startLat = Double.parseDouble(payload.get("startLat").toString());
            double startLon = Double.parseDouble(payload.get("startLon").toString());
            double endLat = Double.parseDouble(payload.get("endLat").toString());
            double endLon = Double.parseDouble(payload.get("endLon").toString());
            String startName = payload.get("startName").toString();
            String endName = payload.get("endName").toString();

            Container container = containerRepository.findById(containerId)
                    .orElseThrow(() -> new RuntimeException("Container not found!"));

            Trip newTrip = tripAssignmentService.assignNewTrip(container, startLat, startLon, endLat, endLon, startName, endName);

            return ResponseEntity.ok(newTrip);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error parsing request: " + e.getMessage());
        }
    }

    // React එකට දත්ත යවන අලුත් GET API එක
    @GetMapping("/container/{containerId}")
    public ResponseEntity<?> getTripForContainer(@PathVariable Long containerId) {
        try {
            // මෙන්න මේ පේළිය තමයි අලුත් නමට මාරු කළේ
            List<Trip> trips = tripRepository.findByContainer_ContainerIdOrderByIdDesc(containerId);
            
            if (trips.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(trips.get(0));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching trip: " + e.getMessage());
        }
    }
}