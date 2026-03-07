# 🍽️ SmartMess - AI Powered Mess Management System

```{=html}
<p align="center">
```
![SmartMess](https://img.shields.io/badge/SmartMess-Mess%20Management%20System-blue?style=for-the-badge&logo=databricks&logoColor=white)
![Spring
Boot](https://img.shields.io/badge/SpringBoot-Backend-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge&logo=mysql)
![Tailwind](https://img.shields.io/badge/TailwindCSS-UI-cyan?style=for-the-badge&logo=tailwindcss)

```{=html}
</p>
```

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<img src="https://media.giphy.com/media/3o7TKU8RvQuomFfUUU/giphy.gif" width="700">`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

# 🚀 SmartMess ERP

**SmartMess** is a **full-stack Mess Management System** designed to
manage institutional food operations efficiently.

The system helps institutions manage:

-   📦 Food Inventory
-   🍛 Daily Consumption
-   🗑 Waste Tracking
-   📊 Price Analysis
-   🧾 Recipes
-   💬 Student Feedback

Built using **Spring Boot + React + MySQL** with a **three-tier
architecture**.

------------------------------------------------------------------------

# 🎯 Project Goals

✔ Reduce food wastage\
✔ Improve inventory tracking\
✔ Optimize mess operations\
✔ Provide real-time analytics\
✔ Maintain standardized recipes

------------------------------------------------------------------------

# 🧠 System Architecture

    React Frontend
          │
          │ Axios API
          ▼
    Spring Boot Backend
          │
          │ Hibernate / JPA
          ▼
    MySQL Database

------------------------------------------------------------------------

# 📁 Project Structure

    SmartMess
    │
    ├── backend
    │   └── smartmess-backend
    │       ├── src
    │       ├── pom.xml
    │       └── README.md
    │
    ├── frontend
    │   └── smartmess-frontend
    │       ├── src
    │       ├── package.json
    │       └── README.md
    │
    ├── database
    │   └── smartmess_database.sql
    │
    ├── docs
    │   └── architecture.png
    │
    ├── .gitignore
    └── README.md

------------------------------------------------------------------------

# ⚙️ Getting Started

## 1️⃣ Clone the Repository

``` bash
git clone https://github.com/your-username/smartmess.git
cd smartmess
```

------------------------------------------------------------------------

# 🗄 Database Setup

1.  Open **MySQL Workbench**
2.  Run the SQL file:

```{=html}
<!-- -->
```
    database/smartmess_database.sql

This will:

-   Create database `smart_mess`
-   Create all tables
-   Insert sample data

------------------------------------------------------------------------

# 🔧 Backend Setup (Spring Boot)

Navigate to backend folder:

``` bash
cd backend/smartmess-backend
```

Ensure installed:

-   Java 17+
-   Maven
-   MySQL

Edit:

    src/main/resources/application.properties

Example:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_mess
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run backend:

``` bash
mvn clean install
mvn spring-boot:run
```

Backend runs:

    http://localhost:8080

------------------------------------------------------------------------

# 💻 Frontend Setup (React)

Navigate:

``` bash
cd frontend/smartmess-frontend
```

Install dependencies:

``` bash
npm install
```

Start server:

``` bash
npm start
```

Frontend runs:

    http://localhost:3000

------------------------------------------------------------------------

# 📊 Core Features

## 📦 Inventory Management

Track stock levels of:

-   Rice
-   Wheat
-   Oil
-   Vegetables
-   Pulses

Features:

-   Add stock
-   Update stock
-   Delete stock
-   Low stock alerts

------------------------------------------------------------------------

# 🍛 Usage & Waste Logging

System records:

-   Daily ingredient consumption
-   Waste quantity
-   Remaining stock

Helps minimize food wastage.

------------------------------------------------------------------------

# 📈 Price History Tracking

Stores price changes of raw materials over time.

Example:

-   Rice price January
-   Rice price February
-   Rice price March

Benefits:

-   Budget planning
-   Vendor comparison
-   Price trend analysis

------------------------------------------------------------------------

# 🍲 Recipe Management

Define standard recipes.

Example:

Meal: Vegetable Biryani

Ingredients:

-   Rice 1kg
-   Carrot 200g
-   Beans 150g
-   Oil 100ml

------------------------------------------------------------------------

# 💬 Feedback System

Students can submit feedback.

Example:

Meal: Lunch\
Rating: 4/5\
Comment: Good taste but less salt

Admin dashboard displays feedback insights.

------------------------------------------------------------------------

# 📊 Database Tables

Main tables:

-   users
-   inventory
-   recipes
-   ingredients
-   usage_logs
-   waste_logs
-   price_history
-   feedback

------------------------------------------------------------------------

# 🔐 Security Features

-   Authentication login
-   Role-based access
-   Protected APIs
-   Secure backend endpoints

------------------------------------------------------------------------

# 🖥 Technology Stack

  Technology        Purpose
  ----------------- ----------------
  React.js          Frontend
  Tailwind CSS      UI Styling
  Spring Boot       Backend
  Spring Security   Authentication
  MySQL             Database
  Hibernate         ORM
  Axios             API Calls

------------------------------------------------------------------------

# 🎓 Learning Outcomes

This project demonstrates:

-   Full Stack Development
-   React + Spring Boot Integration
-   REST API Development
-   Database Design
-   Backend Security
-   Scalable architecture

------------------------------------------------------------------------

# 🚀 Future Improvements

-   AI demand prediction
-   Mobile application
-   Advanced analytics dashboards
-   SMS low stock alerts
-   Automatic purchase orders

------------------------------------------------------------------------

# 👨‍💻 Author

**Krishna**\
Final Year Computer Science Engineering

------------------------------------------------------------------------

# ⭐ Support

If you like this project:

⭐ Star the repository\
🍴 Fork the project\
🚀 Contribute improvements

------------------------------------------------------------------------

# 🎯 Mission

**Build a smart mess system that eliminates food wastage and improves
efficiency.**

