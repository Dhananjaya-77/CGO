package com.example.demo.dto;

import lombok.Data;

@Data
public class UnlockRequest {
    private String containerId;
    private String unlockCode;
}
