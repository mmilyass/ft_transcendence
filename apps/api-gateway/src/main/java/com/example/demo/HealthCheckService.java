package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

import java.net.InetSocketAddress;
import java.net.Socket;


@Service
public class HealthCheckService {

    private final RestTemplate restTemplate =
            new RestTemplate();

    @Value("${AUTH_SERVICE_URI:http://localhost:8081}")
    private String authServiceUri;

    @Value("${APPOINTMENT_SERVICE_URI:http://localhost:8083}")
    private String appointmentServiceUri;

    @Value("${RABBITMQ_HOST:rabbitmq}")
    private String rabbitMqHost;

    @Value("${RABBITMQ_PORT:5672}")
    private int rabbitMqPort;

    private volatile boolean authHealthy = false;
    private volatile boolean appointmentHealthy = false;
    private volatile boolean rabbitMqHealthy = false;

    @Scheduled(fixedRate = 10000)
    public void checkServices() {

        authHealthy =
                check(authServiceUri + "/health");

        appointmentHealthy =
                check(appointmentServiceUri + "/health");

        rabbitMqHealthy =
                checkTcp(rabbitMqHost, rabbitMqPort);
    }

    private boolean check(String url) {
        try {
            restTemplate.getForObject(
                    url,
                    String.class
            );
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkTcp(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 2000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isAuthHealthy() {
        return authHealthy;
    }

    public boolean isAppointmentHealthy() {
        return appointmentHealthy;
    }

    public boolean isRabbitMqHealthy() {
        return rabbitMqHealthy;
    }
}