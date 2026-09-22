package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class StatusController {

    private final HealthCheckService health;

    public StatusController(HealthCheckService health) {
        this.health = health;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        boolean auth = health.isAuthHealthy();
        boolean appointment = health.isAppointmentHealthy();
        boolean rabbitMq = health.isRabbitMqHealthy();
        boolean gateway = true;

        Map<String, Object> services = new LinkedHashMap<>();
        services.put("gateway", componentStatus("API Gateway", gateway));
        services.put("auth", componentStatus("Auth Service", auth));
        services.put("appointment", componentStatus("Appointment Service (slots)", appointment));
        services.put("messageBroker", componentStatus("Message Broker (RabbitMQ) — powers Notification Service", rabbitMq));

        boolean allHealthy = auth && appointment && rabbitMq;

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", allHealthy ? "operational" : "degraded");
        body.put("timestamp", Instant.now().toString());
        body.put("services", services);
        return body;
    }

    private Map<String, Object> componentStatus(String name, boolean healthy) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("name", name);
        m.put("healthy", healthy);
        m.put("status", healthy ? "up" : "down");
        return m;
    }
}
