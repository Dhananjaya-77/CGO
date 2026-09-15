package com.example.demo.dto;

import lombok.Data;

@Data
public class ShipmentRequest {
    private String containerId;
    private String deviceId;
    private String origin;
    private String destination;
    private String unlockCode;
}
