package com.smartmess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDate;

@SpringBootApplication
public class SmartMessApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartMessApplication.class, args);
    }

    // ==================== CORS CONFIGURATION (Frontend Connection) ====================
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000"); // Allow React Frontend
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

@Entity
@Table(name = "usage_log")
class UsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name")
    private String itemName;
    @Column(name = "qty_used")
    private Double qtyUsed;
    @Column(name = "date_time")
    private LocalDate dateTime;

    public UsageLog() { this.dateTime = LocalDate.now(); }
    public UsageLog(String itemName, Double qtyUsed) {
        this.itemName = itemName;
        this.qtyUsed = qtyUsed;
        this.dateTime = LocalDate.now();
    }
    // Getters
    public Long getId() { return id; }
    public String getItemName() { return itemName; }
    public Double getQtyUsed() { return qtyUsed; }
    public LocalDate getDateTime() { return dateTime; }
}

// ==================== REPOSITORIES ====================
interface UsageLogRepository extends JpaRepository<UsageLog, Long> {
    List<UsageLog> findAllByOrderByDateTimeDesc();
}

// ==================== DTOs ====================
class ApiResponse {
    public boolean success;
    public String message;
    public Object data;
    public ApiResponse(boolean success, String message, Object data) {
        this.success = success; this.message = message; this.data = data;
    }
}

class ConsumptionRequest {
    public String itemName;
    public Double quantity;
}

class EventPredictionRequest {
    public int guestCount;
    public String menuType;
}

class EventForecastItem {
    public String itemName;
    public Double required;
    public Double current;
    public String status;
    public EventForecastItem(String i, Double r, Double c, String s) {
        this.itemName=i; this.required=r; this.current=c; this.status=s;
    }
}
