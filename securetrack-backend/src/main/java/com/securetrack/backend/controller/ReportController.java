package com.securetrack.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securetrack.backend.dto.ReportSummaryDTO;
import com.securetrack.backend.models.Alert;
import com.securetrack.backend.repository.AlertRepository;
import com.securetrack.backend.repository.ContainerRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping("/summary")
    public ReportSummaryDTO getReportSummary() {
        
        // 1. ඇත්තම Database Counts ගැනීම
        long totalContainers = containerRepository.count();
        long totalAlerts = alertRepository.count();
        List<Alert> allAlerts = alertRepository.findAll();

        // 2. Stat Cards සඳහා දත්ත සැකසීම
        List<ReportSummaryDTO.StatCard> statCards = List.of(
            ReportSummaryDTO.StatCard.builder().label("Total Shipments").value(String.valueOf(totalContainers)).trend("+5%").direction("up").build(),
            ReportSummaryDTO.StatCard.builder().label("On-Time Delivery").value("92%").trend("+1.2%").direction("up").build(),
            ReportSummaryDTO.StatCard.builder().label("Total Alerts").value(String.valueOf(totalAlerts)).trend("-2%").direction("down").build(),
            ReportSummaryDTO.StatCard.builder().label("Avg Transit Time").value("4.5h").trend("-0.1h").direction("down").build()
        );

        // 3. Alert Pie Chart එකට අදාළව Database එකේ Alerts වර්ග කිරීම
        Map<String, Long> alertsByType = allAlerts.stream()
                .collect(Collectors.groupingBy(a -> a.getType() != null ? a.getType().name() : "OTHER", Collectors.counting()));

        List<ReportSummaryDTO.AlertDistribution> alertDist = new ArrayList<>();
        String[] colors = {"#dc2626", "#ea580c", "#f59e0b", "#fbbf24", "#3b82f6"};
        int colorIdx = 0;
        
        for (Map.Entry<String, Long> entry : alertsByType.entrySet()) {
            String formatName = entry.getKey().replace("_", " ");
            alertDist.add(ReportSummaryDTO.AlertDistribution.builder()
                    .name(formatName)
                    .value(entry.getValue().intValue())
                    .color(colors[colorIdx % colors.length])
                    .build());
            colorIdx++;
        }

        // Database එකේ Alerts මුකුත් නැත්නම් Dummy එකක් යවනවා Chart එක හිස් නොවෙන්න
        if (alertDist.isEmpty()) {
            alertDist.add(ReportSummaryDTO.AlertDistribution.builder().name("No Alerts").value(1).color("#cbd5e1").build());
        }

        // 4. Bar Chart එකට දත්ත සැකසීම
        List<ReportSummaryDTO.ShipmentActivity> shipmentActivity = List.of(
            ReportSummaryDTO.ShipmentActivity.builder().day("Mon").shipments(10).completed(8).build(),
            ReportSummaryDTO.ShipmentActivity.builder().day("Tue").shipments(15).completed(12).build(),
            ReportSummaryDTO.ShipmentActivity.builder().day("Wed").shipments(totalContainers > 0 ? (int)totalContainers : 5).completed(2).build(),
            ReportSummaryDTO.ShipmentActivity.builder().day("Thu").shipments(20).completed(18).build(),
            ReportSummaryDTO.ShipmentActivity.builder().day("Fri").shipments(12).completed(10).build()
        );

        return ReportSummaryDTO.builder()
                .statCards(statCards)
                .shipmentActivity(shipmentActivity)
                .alertDistribution(alertDist)
                .build();
    }
}