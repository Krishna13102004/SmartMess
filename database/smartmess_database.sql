-- 1. Setup Database
CREATE DATABASE IF NOT EXISTS smart_mess;
USE smart_mess;

-- 2. Create Inventory Table
DROP TABLE IF EXISTS inventory;
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255),
    unit VARCHAR(50),
    current_stock DOUBLE,
    min_limit DOUBLE,
    price_per_unit DOUBLE,
    avg_daily_usage DOUBLE DEFAULT 0.0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Usage Log Table
DROP TABLE IF EXISTS usage_log;
CREATE TABLE IF NOT EXISTS usage_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    qty_used DOUBLE,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Price History Table
DROP TABLE IF EXISTS price_history;
CREATE TABLE IF NOT EXISTS price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    price DOUBLE,
    date_recorded DATE
);

-- 5. Create Waste Log Table
DROP TABLE IF EXISTS waste_log;
CREATE TABLE IF NOT EXISTS waste_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    qty_wasted DOUBLE,
    reason VARCHAR(255),
    loss_amount DOUBLE,
    date_recorded DATE
);

-- 6. Create Feedback Table
DROP TABLE IF EXISTS feedback;
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating INT,
    comments VARCHAR(500),
    meal_type VARCHAR(50),
    date_recorded DATE
);

-- 7. Create Recipe Tables
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;

CREATE TABLE IF NOT EXISTS recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    base_servings INT,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT,
    item_name VARCHAR(255),
    quantity DOUBLE,
    unit VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- ====================================================
-- 🚀 MASSIVE DATASET INSERT (75+ ITEMS)
-- ====================================================

INSERT INTO inventory (item_name, category, unit, current_stock, min_limit, price_per_unit, avg_daily_usage) VALUES
-- 🍚 Grains & Flours
('Rice', 'Grains', 'kg', 500, 100, 60.0, 25.0),
('Basmati Rice', 'Grains', 'kg', 100, 20, 120.0, 10.0),
('Idli Rice', 'Grains', 'kg', 300, 50, 45.0, 20.0),
('Wheat Flour', 'Grains', 'kg', 200, 30, 45.0, 15.0),
('Maida', 'Grains', 'kg', 50, 10, 40.0, 5.0),
('Rava (Sooji)', 'Grains', 'kg', 40, 10, 50.0, 5.0),
('Vermicelli', 'Grains', 'kg', 30, 5, 45.0, 3.0),
('Rice Flour', 'Grains', 'kg', 20, 5, 35.0, 1.0),
('Besan Flour', 'Grains', 'kg', 30, 5, 90.0, 2.0),
('Corn Flour', 'Grains', 'kg', 10, 2, 60.0, 0.5),

-- 🍲 Pulses & Dals
('Toor Dal', 'Pulses', 'kg', 80, 20, 110.0, 6.0),
('Urad Dal', 'Pulses', 'kg', 60, 15, 120.0, 5.0),
('Moong Dal', 'Pulses', 'kg', 40, 10, 105.0, 4.0),
('Chana Dal', 'Pulses', 'kg', 50, 10, 90.0, 4.0),
('Masoor Dal', 'Pulses', 'kg', 30, 5, 95.0, 2.0),
('Fried Gram (Pottukadalai)', 'Pulses', 'kg', 15, 5, 80.0, 1.0),
('Green Peas (Dry)', 'Pulses', 'kg', 25, 5, 70.0, 2.0),
('Chickpeas (White Chana)', 'Pulses', 'kg', 40, 10, 130.0, 3.0),
('Black Chana', 'Pulses', 'kg', 30, 10, 80.0, 3.0),
('Rajma', 'Pulses', 'kg', 20, 5, 140.0, 2.0),

-- 🛢️ Oils & Ghee
('Sunflower Oil', 'Oils', 'L', 150, 30, 140.0, 10.0),
('Gingelly Oil', 'Oils', 'L', 50, 10, 380.0, 2.0),
('Coconut Oil', 'Oils', 'L', 20, 5, 250.0, 1.0),
('Palm Oil', 'Oils', 'L', 80, 20, 110.0, 5.0),
('Ghee', 'Oils', 'L', 25, 5, 650.0, 1.5),
('Vanaspati', 'Oils', 'kg', 20, 5, 120.0, 1.0),

-- 🌶️ Spices & Masalas
('Mustard Seeds', 'Spices', 'kg', 10, 2, 90.0, 0.2),
('Cumin (Jeera)', 'Spices', 'kg', 10, 2, 350.0, 0.3),
('Fennel (Sombu)', 'Spices', 'kg', 5, 1, 280.0, 0.2),
('Pepper (Whole)', 'Spices', 'kg', 5, 1, 600.0, 0.2),
('Fenugreek (Vendhayam)', 'Spices', 'kg', 5, 1, 100.0, 0.1),
('Dry Chilli (Red)', 'Spices', 'kg', 15, 3, 250.0, 0.5),
('Tamarind', 'Spices', 'kg', 30, 5, 180.0, 1.0),
('Crystal Salt', 'Spices', 'kg', 50, 10, 15.0, 2.0),
('Powder Salt', 'Spices', 'kg', 50, 10, 20.0, 2.0),
('Sugar', 'Spices', 'kg', 80, 20, 42.0, 5.0),
('Jaggery', 'Spices', 'kg', 20, 5, 60.0, 1.0),
('Chilli Powder', 'Spices', 'kg', 20, 5, 280.0, 0.5),
('Turmeric Powder', 'Spices', 'kg', 10, 2, 220.0, 0.2),
('Coriander Powder', 'Spices', 'kg', 10, 2, 180.0, 0.4),
('Garam Masala', 'Spices', 'kg', 5, 1, 450.0, 0.2),
('Chicken Masala', 'Spices', 'kg', 10, 2, 500.0, 0.3),
('Sambar Powder', 'Spices', 'kg', 15, 3, 350.0, 0.5),
('Asafoetida (Hing)', 'Spices', 'kg', 2, 0.5, 900.0, 0.05),
('Cardamom (Elakkai)', 'Spices', 'kg', 1, 0.2, 2500.0, 0.02),
('Cloves', 'Spices', 'kg', 1, 0.2, 1200.0, 0.02),
('Cinnamon (Pattai)', 'Spices', 'kg', 1, 0.2, 800.0, 0.02),
('Bay Leaf', 'Spices', 'kg', 1, 0.2, 400.0, 0.01),
('Cashew Nuts', 'Spices', 'kg', 5, 1, 850.0, 0.1),

-- 🥦 Vegetables (Fresh Stock)
('Onion (Big)', 'Veggies', 'kg', 150, 30, 35.0, 15.0),
('Onion (Small)', 'Veggies', 'kg', 50, 10, 80.0, 5.0),
('Tomato', 'Veggies', 'kg', 80, 20, 40.0, 10.0),
('Potato', 'Veggies', 'kg', 120, 30, 30.0, 12.0),
('Carrot', 'Veggies', 'kg', 30, 5, 60.0, 3.0),
('Beans', 'Veggies', 'kg', 25, 5, 70.0, 2.0),
('Beetroot', 'Veggies', 'kg', 20, 5, 45.0, 2.0),
('Cabbage', 'Veggies', 'kg', 40, 10, 25.0, 4.0),
('Cauliflower', 'Veggies', 'kg', 30, 5, 35.0, 3.0),
('Brinjal', 'Veggies', 'kg', 25, 5, 40.0, 3.0),
('Ladies Finger', 'Veggies', 'kg', 20, 5, 50.0, 2.0),
('Drumstick', 'Veggies', 'kg', 15, 3, 80.0, 1.0),
('Snake Gourd', 'Veggies', 'kg', 15, 3, 35.0, 2.0),
('Pumpkin', 'Veggies', 'kg', 20, 5, 20.0, 2.0),
('Garlic', 'Veggies', 'kg', 15, 3, 120.0, 0.5),
('Ginger', 'Veggies', 'kg', 10, 2, 100.0, 0.5),
('Green Chilli', 'Veggies', 'kg', 10, 2, 60.0, 0.3),
('Lemon', 'Veggies', 'kg', 5, 1, 150.0, 0.5),
('Coconut', 'Veggies', 'units', 50, 10, 25.0, 5.0),
('Coriander Leaves', 'Veggies', 'bunch', 20, 5, 10.0, 2.0),
('Curry Leaves', 'Veggies', 'bunch', 10, 2, 5.0, 1.0),
('Mint Leaves', 'Veggies', 'bunch', 10, 2, 10.0, 1.0),

-- 🥛 Dairy & Beverages
('Milk', 'Dairy', 'L', 80, 20, 55.0, 20.0),
('Curd', 'Dairy', 'kg', 30, 5, 70.0, 8.0),
('Paneer', 'Dairy', 'kg', 15, 3, 380.0, 2.0),
('Butter', 'Dairy', 'kg', 10, 2, 450.0, 1.0),
('Tea Powder', 'Beverages', 'kg', 15, 3, 300.0, 1.5),
('Coffee Powder', 'Beverages', 'kg', 8, 2, 800.0, 0.5),

-- 🧼 Cleaning & Essentials
('Dish Wash Liquid', 'Cleaning', 'L', 30, 5, 85.0, 0.5),
('Detergent Powder', 'Cleaning', 'kg', 20, 5, 100.0, 0.5),
('Bleaching Powder', 'Cleaning', 'kg', 10, 2, 50.0, 0.2),
('Floor Cleaner (Phenyl)', 'Cleaning', 'L', 20, 5, 60.0, 0.5),
('Scrubber', 'Cleaning', 'units', 50, 10, 10.0, 1.0),
('Broom Stick (Soft)', 'Cleaning', 'units', 10, 2, 80.0, 0.0),
('Broom Stick (Hard)', 'Cleaning', 'units', 10, 2, 60.0, 0.0);

-- Insert Price History (Sample Data for Chart)
INSERT INTO price_history (item_name, price, date_recorded) VALUES
('Rice', 55.0, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
('Rice', 58.0, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
('Rice', 56.0, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
('Rice', 60.0, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
('Rice', 62.0, CURDATE()),
('Toor Dal', 100.0, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
('Toor Dal', 105.0, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
('Toor Dal', 115.0, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
('Toor Dal', 110.0, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
('Toor Dal', 112.0, CURDATE());

-- Insert Recipes
INSERT INTO recipes (name, base_servings, instructions) VALUES
('Vegetable Biryani', 100, 'Soak rice. Chop veggies. Cook spices. Layer and dum cook.'),
('Sambar Rice', 100, 'Cook dal. Boil veggies with tamarind. Mix with rice.'),
('Chapati & Kurma', 100, 'Knead dough. Make chapatis. Prepare veg kurma.');

INSERT INTO recipe_ingredients (recipe_id, item_name, quantity, unit) VALUES
-- Veg Biryani (for 100)
(1, 'Basmati Rice', 20, 'kg'), (1, 'Onion (Big)', 10, 'kg'), (1, 'Potato', 5, 'kg'), (1, 'Ghee', 2, 'L'), (1, 'Curd', 5, 'kg'),
-- Sambar Rice (for 100)
(2, 'Rice', 25, 'kg'), (2, 'Toor Dal', 10, 'kg'), (2, 'Tomato', 5, 'kg'), (2, 'Crystal Salt', 1, 'kg'),
-- Chapati (for 100)
(3, 'Wheat Flour', 25, 'kg'), (3, 'Sunflower Oil', 3, 'L'), (3, 'Potato', 10, 'kg'), (3, 'Onion (Big)', 5, 'kg');


select * from inventory;
