package com.example.demo;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ServiceAvailabilityInterceptor
        implements HandlerInterceptor {

    private final HealthCheckService health;

    public ServiceAvailabilityInterceptor(
            HealthCheckService health) {
        this.health = health;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        String path = request.getRequestURI();

        if (path.startsWith("/auth")
                || path.startsWith("/users")
                || path.startsWith("/doctor")
                || path.startsWith("/admin")) {

            if (!health.isAuthHealthy()) {
                response.sendError(
                        503,
                        "Auth service unavailable"
                );
                return false;
            }
        }

        if (path.startsWith("/slots")
                || path.startsWith("/services")) {

            if (!health.isAppointmentHealthy()) {
                response.sendError(
                        503,
                        "Appointment service unavailable"
                );
                return false;
            }
        }

        return true;
    }
}