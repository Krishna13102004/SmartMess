# SmartMess - Mess Management System

SmartMess is a comprehensive solution for managing mess inventory, usage, waste, and feedback.

## Project Structure

```
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
```

## Getting Started

### Database Setup
1. Use the SQL script provided in `database/smartmess_database.sql` to initialize your MySQL database.
2. The script will create the `smart_mess` database and all necessary tables with sample data.

### Backend Setup
- Navigate to `backend/smartmess-backend`.
- Ensure you have Java and Maven installed.
- Configure your database credentials in `src/main/resources/application.properties` (if applicable).
- Run the backend application.

### Frontend Setup
- Navigate to `frontend/smartmess-frontend`.
- Run `npm install` to install dependencies.
- Run `npm start` to start the development server.

## Features
- **Inventory Management**: Track grain, oil, and vegetable stock.
- **Usage & Waste Logging**: Keep records of daily usage and minimize waste.
- **Price History**: Analyze price trends over time.
- **Recipe Management**: Standardize meals with defined ingredients.
- **Feedback System**: Collect and analyze meal feedback.
