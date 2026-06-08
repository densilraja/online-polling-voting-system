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

\`\`\`
online-polling-voting-system/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   └── main/java/...     # Controllers, Services, Repositories
│   └── pom.xml
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── README.md
\`\`\`

## ⚙️ Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup
\`\`\`bash
cd backend
# Configure your DB credentials in application.properties
mvn spring-boot:run
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### Database Setup
\`\`\`sql
CREATE DATABASE polling_db;
-- Then run the schema file in /backend/src/main/resources/schema.sql
\`\`\`

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



## 👤 Author
**Irudhaya Densil Raja J**  
[LinkedIn](https://www.linkedin.com/in/densilraja/) | 
[Portfolio](https://densilraja.github.io/portfolio-website/) | 
[GitHub](https://github.com/densilraja)

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
