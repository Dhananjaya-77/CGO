package com.securetrack.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.securetrack.backend.models.Container;
import com.securetrack.backend.models.Trip;
import com.securetrack.backend.repository.TripRepository;

@Service 
public class TripAssignmentService {

    @Autowired
    private TripRepository tripRepository;

    public Trip assignNewTrip(Container container, double startLat, double startLon, double endLat, double endLon, String startName, String endName) {
        
        // OSRM API එකට කතා කිරීම
        String osrmUrl = String.format(
            "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson", 
            startLon, startLat, endLon, endLat
        );
        
        String routeJson = "";
        try {
            RestTemplate restTemplate = new RestTemplate();
            routeJson = restTemplate.getForObject(osrmUrl, String.class);
            System.out.println("OSRM Route Fetched Successfully!");
        } catch (Exception e) {
            System.err.println("OSRM Error: " + e.getMessage());
        }

        Trip newTrip = Trip.builder()
                .container(container)
                .startLat(startLat)
                .startLon(startLon)
                .endLat(endLat)
                .endLon(endLon)
                .startLocationName(startName)
                .endLocationName(endName)
                .routeCoordinatesJson(routeJson)
                .status("PLANNED")
                .startTime(LocalDateTime.now())
                .build();

        return tripRepository.save(newTrip);
    }
}