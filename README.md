# Asset Insights - User Management Application by Miko Zagrodzki

Welcome to the User Management Application! This project is a RESTful web application built to manage users. It allows you to:

- Display users in a list/table.
- Create new users.
- Update existing users.
- Delete users.

This README provides details on how to set up the application, run it, and test its functionality.

---

## 🛠️ Technologies Used

### Backend
- **Node.js**: Backend implementation via a RESTful API.
- **Database**: SQL database (DB url is in /lib/db).

### Frontend
- **React** with **Next.js**: Provides a user-friendly interface.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

### Steps to Initialize the Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/MikoZagrodzki/asset-insights-assignment
   cd your-repo
Install dependencies:

bash
npm install
Run the development server:

bash
npm run dev
The application will be available at http://localhost:3000.

(Optional) If using a database, ensure it is properly configured in the project. 

---

## 🧪 Running Tests

### Overview of Tests

The project includes comprehensive tests for:

API Functionality: Covers endpoints for creating, reading, updating, and deleting users.
Frontend Components: Ensures the UI components behave as expected.
How to Run Tests
You can run all tests using:

bash
npm test

### Test Environment

The API tests use a mock database environment to simulate database operations. This ensures the tests are isolated from the actual database.
Even though the API tests run in a separate environment, triggering npm test will run both API and frontend tests seamlessly.

### 📄 API Endpoints

#### Users API

The API provides the following endpoints:

GET /api/users: Fetch all users.

POST /api/users: Add a new user.

PUT /api/users: Update an existing user.

DELETE /api/users: Delete a user by ID.

### 📝 Test Descriptions

#### API Tests: Verify that each API endpoint responds as expected, including:

Validation of required fields.
Proper error handling (e.g., missing parameters or invalid inputs).
Successful database interactions.

#### Frontend Tests: Test individual React components, ensuring they render and function correctly.

---

## 🧹 Notes and Extras

The application focuses on functionality and clean, error-handled.
The codebase is modular and easy to extend if additional features are required.

---
