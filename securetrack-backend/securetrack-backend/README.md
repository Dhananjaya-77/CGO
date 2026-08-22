# SecureTrack SL - Backend (Spring Boot)

IoT-based Real-Time Container Monitoring and Anti-Theft Framework for Sri Lanka Customs.

## Stack
- Java 25, Spring Boot 3.3.x
- MySQL 8.0 (Spring Data JPA / Hibernate)
- Spring Security + JWT (stateless, RBAC)
- Eclipse Paho MQTT v5 client (ESP32 edge telemetry ingestion)
- Lombok

## Getting Started

1. **Create the database** (or let `createDatabaseIfNotExist=true` handle it):
   ```sql
   CREATE DATABASE securetrack_db;
   ```
2. Edit `src/main/resources/application.properties`:
   - `spring.datasource.username` / `spring.datasource.password`
   - `securetrack.jwt.secret` (use a strong 256-bit secret in production)
   - `securetrack.mqtt.broker-url` (point at your Mosquitto/EMQX MQTT 5.0 broker)
3. Build & run:
   ```bash
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

## Authentication

`POST /auth/login`
```json
{ "username": "admin1", "password": "secret" }
```
Returns a JWT. Send it as `Authorization: Bearer <token>` on all `/api/**` requests.

## Key Endpoints (mapped to SRS Use Cases)

| Use Case | Endpoint |
|---|---|
| Initialize Container Tracking | `POST /api/containers/initialize` (ADMIN, CUSTOM_OFFICER) |
| View Assigned Route | `GET /api/containers/{id}/route` |
| Monitor Real-Time Security Alerts | `GET /api/alerts`, `GET /api/alerts/active` (ADMIN, CUSTOM_OFFICER, INSPECTOR) |
| Complete Shipment / Unlock Seal | `POST /api/containers/{id}/complete` |
| Manage Users | `POST/GET/DELETE /api/admin/users/**` (ADMIN only) |
| Manage Geofences | `GET/POST/PUT/DELETE /api/geofences/**` |
| Register IoT Module | `POST /api/iot-modules/register` |
| REST telemetry fallback (no MQTT broker needed for testing) | `POST /api/iot-modules/telemetry` |

## MQTT Telemetry Flow

1. ESP32 device publishes JSON to `securetrack/container/+/telemetry`:
   ```json
   {
     "deviceUid": "ESP32-CT-001",
     "latitude": 6.9271,
     "longitude": 79.8612,
     "batteryLevel": 87,
     "lightSensorActive": false,
     "magnetSensorActive": true,
     "timestamp": "2026-08-12T10:15:30"
   }
   ```
2. `MqttTelemetryService` parses the payload, updates the `IoTModule`, appends a `TrackingLog` checkpoint.
3. `SecurityMonitoringService` runs **Dual-Sensor Tamper Verification**: a breach is only confirmed when the magnet/reed sensor reports the seal open **and** the light sensor detects light inside - filtering single-sensor false positives.
4. `RouteVerificationService` cross-references the GPS fix against the container's assigned `Geofence` corridor (Haversine distance vs. configurable threshold).
5. Any triggered condition creates an `Alert` and hands it to `AlertNotificationService` for push-out.

## Project Structure

```
src/main/java/com/securetrack/backend/
├── models/        # JPA entities (Staff hierarchy, Driver, Owner, Container, IoTModule, ...)
├── repository/     # Spring Data JPA repositories
├── security/       # JWT + UserDetails bridging Staff/Driver/Owner
├── config/         # SecurityConfig (RBAC filter chain)
├── dto/            # Request/response payloads
├── service/        # Core business logic (MQTT, Security, Route, Alerts, Audit, Auth, Users, Shipment)
├── controller/      # REST controllers
└── exception/       # Centralized error handling
```

## Default Role-Based Access Control

- `/auth/**` - public
- `/api/admin/**` - `ROLE_ADMIN` only
- `/api/alerts/**` - `ROLE_ADMIN`, `ROLE_CUSTOM_OFFICER`, `ROLE_INSPECTOR`
- `/api/containers/initialize` - `ROLE_ADMIN`, `ROLE_CUSTOM_OFFICER`
- `/api/containers/*/complete` - `ROLE_ADMIN`, `ROLE_CUSTOM_OFFICER`, `ROLE_INSPECTOR`
- All other `/api/**` - any authenticated user (Staff, Driver, Owner)
