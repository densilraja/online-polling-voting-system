# 🗳️ Online Polling and Voting System

A full-stack web application for creating and participating in polls and votes 
with secure authentication and real-time results.

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js, HTML, CSS     |
| Backend   | Java, Spring Boot, REST APIs |
| Database  | MySQL                   |
| Auth      | JWT / Spring Security   |
| Tools     | Postman, IntelliJ, VS Code |

## ✨ Features

- 🔐 User registration and login with authentication
- 📋 Create polls with multiple options
- ✅ Vote on active polls (one vote per user)
- 📊 Real-time vote count and result visualization
- 🛡️ Input validation and access control
- 🗄️ Relational database schema for data consistency

## 📁 Project Structure
```

online-polling-voting-system/
├── backend/                        # Spring Boot application
│   ├── src/
│   │   └── main/java/
│   │       ├── controller/         # REST Controllers
│   │       ├── service/            # Business Logic
│   │       ├── repository/         # DB Repositories
│   │       └── model/              # Entity Classes
│   └── pom.xml
├── frontend/                       # React application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   └── pages/                  # Route-level pages
│   └── package.json
├── assets/                         # Screenshots
└── README.md

```

## ⚙️ Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup

```

cd backend
```
# Configure your DB credentials in application.properties
```
mvn spring-boot:run
```
### Frontend Setup
```
cd frontend
npm install
npm start
```

### Database Setup
```
sql
CREATE DATABASE polling_db;
-- Then run the schema file in /backend/src/main/resources/schema.sql
```

## 🔗 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/auth/register    | Register a new user  |
| POST   | /api/auth/login       | Login and get token  |
| GET    | /api/polls            | Get all polls        |
| POST   | /api/polls            | Create a new poll    |
| POST   | /api/polls/{id}/vote  | Cast a vote          |
| GET    | /api/polls/{id}/results | Get poll results   |

## 📸 Screenshots

## Poll Dashboard
<img width="1915" height="967" alt="Screenshot 2026-06-08 152714" src="https://github.com/user-attachments/assets/a1fde008-c558-4225-95d7-5e80ca519ca9" />

## Users
<img width="1918" height="971" alt="Screenshot 2026-06-08 152728" src="https://github.com/user-attachments/assets/d6d3465d-0f6f-4471-a1e3-2c882f0a6834" />

## Candidates
<img width="1918" height="972" alt="Screenshot 2026-06-08 152740" src="https://github.com/user-attachments/assets/b440a67f-44cb-4523-82e9-2e5a4bc45f44" />

## Positions
<img width="1918" height="972" alt="Screenshot 2026-06-08 152749" src="https://github.com/user-attachments/assets/01ea00fd-3b87-427d-ab1f-830b574f2697" />

## Poll Settings
<img width="1918" height="970" alt="Screenshot 2026-06-08 152801" src="https://github.com/user-attachments/assets/7cb5bc2e-158e-4f3c-bcb3-8726f8c6b5a8" />

## Analytics
<img width="1918" height="967" alt="Screenshot 2026-06-08 152812" src="https://github.com/user-attachments/assets/3669a87f-faa0-4f4d-bc04-96cc409b4dd5" />

## User Page
<img width="1918" height="971" alt="Screenshot 2026-06-08 152836" src="https://github.com/user-attachments/assets/c4dc2b5e-7fbc-4b4d-a0fe-284fca0c15b5" />


## 👤 Author
**Irudhaya Densil Raja J**  
[LinkedIn](https://www.linkedin.com/in/densilraja/) | 
[Portfolio](https://densilraja.github.io/portfolio-website/) | 
[GitHub](https://github.com/densilraja)

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
