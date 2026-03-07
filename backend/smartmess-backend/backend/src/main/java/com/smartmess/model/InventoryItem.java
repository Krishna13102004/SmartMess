package com.smartmess.model;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", unique = true)
    private String itemName;

    @Column(name = "current_stock")
    private Double currentStock; 

    private String unit;
    private String category;

    // 🔥 NEW FIELDS ADDED (Dashboard ku thevai)
    @Column(name = "min_limit")
    private Double minLimit;

    @Column(name = "price_per_unit")
    private Double pricePerUnit;

    @Column(name = "avg_daily_usage")
    private Double avgDailyUsage;

    @Column(name = "last_updated")
    private String lastUpdated;

    // Constructor
    public InventoryItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getCurrentStock() { return currentStock; }
    public void setCurrentStock(Double currentStock) { this.currentStock = currentStock; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getMinLimit() { return minLimit; }
    public void setMinLimit(Double minLimit) { this.minLimit = minLimit; }

    public Double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public Double getAvgDailyUsage() { return avgDailyUsage; }
    public void setAvgDailyUsage(Double avgDailyUsage) { this.avgDailyUsage = avgDailyUsage; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}