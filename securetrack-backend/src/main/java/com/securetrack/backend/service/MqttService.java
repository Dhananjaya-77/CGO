package com.securetrack.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;

//@Service
public class MqttService {

    private final String BROKER_URL = "tcp://broker.hivemq.com:1883";
    private final String CLIENT_ID = "SecureTrackBackend_" + System.currentTimeMillis();
    private final String TOPIC = "securetrack/live/location";

    // සජීවීව එන දත්ත තාවකාලිකව ගබඩා කරගන්න Map එකක් (Database එකට දාන්න කලින්)
    private final Map<String, Map<String, Object>> activeLocations = new ConcurrentHashMap<>();

    @PostConstruct
    public void initMqtt() {
        try {
            MqttClient client = new MqttClient(BROKER_URL, CLIENT_ID);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(10);

            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("MQTT Connection lost: " + cause.getMessage());
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    // ESP32 එකෙන් එවන JSON දත්තය මෙතනින් ලබාගන්නවා
                    String payload = new String(message.getPayload());
                    System.out.println("Live Data Received: " + payload);

                    // JSON දත්තය Java Object (Map) එකකට හරවනවා
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, Object> data = mapper.readValue(payload, Map.class);

                    // අලුත්ම Location එක activeLocations එකට Save කරනවා
                    if (data.containsKey("containerId")) {
                        activeLocations.put(data.get("containerId").toString(), data);
                    }
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                }
            });

            client.connect(options);
            client.subscribe(TOPIC);
            System.out.println("Connected to EMQX Broker and subscribed to: " + TOPIC);

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    // React එකට දත්ත යවන්න මේ Method එක පාවිච්චි කරනවා
    public List<Map<String, Object>> getActiveLocations() {
        return new ArrayList<>(activeLocations.values());
    }
}