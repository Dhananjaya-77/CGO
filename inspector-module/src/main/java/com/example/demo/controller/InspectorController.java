package com.example.demo.controller;

import com.example.demo.dto.ShipmentRequest;
import com.example.demo.dto.UnlockRequest;
import com.example.demo.model.Shipment;
import com.example.demo.service.InspectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inspector")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class InspectorController {

    @Autowired
    private InspectorService inspectorService;

    @PostMapping("/initialize")
    public ResponseEntity<Shipment> initializeShipment(@RequestBody ShipmentRequest request) {
        return ResponseEntity.ok(inspectorService.initializeTracking(request));
    }

    @GetMapping("/container/{containerId}")
    public ResponseEntity<Shipment> getContainer(@PathVariable String containerId) {
        return ResponseEntity.ok(inspectorService.getContainerDetails(containerId));
    }

    @PostMapping("/unlock-seal")
    public ResponseEntity<Shipment> unlockSeal(@RequestBody UnlockRequest request) {
        return ResponseEntity.ok(inspectorService.inspectAndUnlock(request));
    }
}