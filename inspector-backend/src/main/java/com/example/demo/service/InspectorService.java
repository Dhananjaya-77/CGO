package com.example.demo.service;

import com.example.demo.dto.ShipmentRequest;
import com.example.demo.dto.UnlockRequest;
import com.example.demo.model.Shipment;
import com.example.demo.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class InspectorService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    public Shipment initializeTracking(ShipmentRequest request) {
        Shipment shipment = new Shipment();
        shipment.setContainerId(request.getContainerId());
        shipment.setDeviceId(request.getDeviceId());
        shipment.setOrigin(request.getOrigin());
        shipment.setDestination(request.getDestination());
        shipment.setUnlockCode(request.getUnlockCode());
        shipment.setSealStatus("LOCKED");
        shipment.setShipmentStatus("ACTIVE");
        shipment.setCreatedAt(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }

    public Shipment getContainerDetails(String containerId) {
        return shipmentRepository.findByContainerId(containerId)
                .orElseThrow(() -> new RuntimeException("Container ID not found: " + containerId));
    }

    public Shipment inspectAndUnlock(UnlockRequest request) {
        Shipment shipment = getContainerDetails(request.getContainerId());

        if (!shipment.getUnlockCode().equals(request.getUnlockCode())) {
            throw new RuntimeException("Invalid Authentication Passcode!");
        }

        shipment.setSealStatus("UNLOCKED");
        shipment.setShipmentStatus("COMPLETED");
        shipment.setCompletedAt(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }
}
