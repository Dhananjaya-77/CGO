package com.securetrack.backend.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportSummaryDTO {
    private List<StatCard> statCards;
    private List<ShipmentActivity> shipmentActivity;
    private List<AlertDistribution> alertDistribution;

    @Data
    @Builder
    public static class StatCard {
        private String label;
        private String value;
        private String trend;
        private String direction;
    }

    @Data
    @Builder
    public static class ShipmentActivity {
        private String day;
        private int shipments;
        private int completed;
    }

    @Data
    @Builder
    public static class AlertDistribution {
        private String name;
        private int value;
        private String color;
    }
}