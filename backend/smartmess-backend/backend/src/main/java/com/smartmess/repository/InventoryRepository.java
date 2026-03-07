package com.smartmess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartmess.model.InventoryItem;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    // 🔥 Idhu dhaan mukkiyam! Item name vechu thedura method
    InventoryItem findByItemName(String itemName);
    
}
