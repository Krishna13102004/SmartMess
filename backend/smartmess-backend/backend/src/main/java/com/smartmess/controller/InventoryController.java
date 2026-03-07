package com.smartmess.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.smartmess.model.InventoryItem;
import com.smartmess.repository.InventoryRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    // ==========================================
    // 1. ADD NEW ITEM
    // ==========================================
    
    @PostMapping("/add")
    public InventoryItem addItemWithUrl(@RequestBody InventoryItem item) {
        return saveItem(item);
    }

    @PostMapping
    public InventoryItem addItemDirect(@RequestBody InventoryItem item) {
        return saveItem(item);
    }

    private InventoryItem saveItem(InventoryItem item) {
        item.setLastUpdated(LocalDateTime.now().toString());
        System.out.println("🟢 SUCCESS: Item Added -> " + item.getItemName());
        return inventoryRepository.save(item);
    }

    // ==========================================
    // 2. GET ALL ITEMS (Dashboard)
    // ==========================================
    @GetMapping("/all")
    public List<InventoryItem> getAllItems() {
        System.out.println("🔵 Dashboard requesting data..."); 
        return inventoryRepository.findAll();
    }

    // ==========================================
    // 3. UPDATE STOCK (Corrected Logic)
    // ==========================================
    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<InventoryItem> updateStock(@PathVariable Long id, @RequestBody InventoryItem itemDetails) {
        Optional<InventoryItem> optionalItem = inventoryRepository.findById(id);
        
        if (optionalItem.isPresent()) {
            InventoryItem item = optionalItem.get();
            
            // 🔥 FIXED HERE: 'getQuantity' illa, 'getCurrentStock' use pannanum!
            item.setCurrentStock(itemDetails.getCurrentStock());
            
            item.setLastUpdated(LocalDateTime.now().toString());
            InventoryItem updatedItem = inventoryRepository.save(item);
            System.out.println("🟠 Stock Updated for: " + item.getItemName());
            return ResponseEntity.ok(updatedItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}