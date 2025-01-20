
# MERN Stack Full-Stack Application

This is a simple full-stack application built using the MERN stack: **MongoDB**, **Express**, **React**, and **Node.js**. The project provides a basic setup for connecting the backend API with the frontend, as well as integrating MongoDB for data storage.

---

## Table of Contents
1. [Installation](#installation)  
2. [Backend Setup](#backend-setup)  
3. [Frontend Setup](#frontend-setup)  
4. [Running the Application](#running-the-application)  
5. [Database Setup](#database-setup)  
6. [Troubleshooting](#troubleshooting)  

---

## Installation

### Prerequisites
Before proceeding, ensure you have the following installed:
- **Node.js**
- **Yarn** (or you can use `npm`)

---

## Backend Setup

1. **Clone the Repository**  
   Clone the repository to your local machine:  
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**  
   In the root directory, install the necessary dependencies for both the backend and the frontend:  
   ```bash
   yarn install
   ```
   This will install dependencies for both the `frontend` and `backend` directories.

3. **Install Backend-specific Dependencies**  
   Navigate to the `api` folder (backend) and ensure all required dependencies are installed:  
   ```bash
   cd api
   yarn add express cors
   ```

4. **Configure MongoDB Connection**  
   Set up the connection to MongoDB in the backend file (e.g., `index.js`). Use a connection string like the following:  
   ```javascript
   const mongoose = require('mongoose');
   const connectionString = "mongodb+srv://<username>:<password>@cluster.mongodb.net/<database-name>?retryWrites=true&w=majority";

   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log("Connected to MongoDB"))
     .catch(err => console.error("MongoDB connection error:", err));
   ```

5. **Run the Backend**  
   Start the backend server:  
   ```bash
   node index.js
   ```
   The backend will run on `http://localhost:4070` (or the port configured in your code).

---

## Frontend Setup

1. **Configure the Frontend**  
   The frontend is built with React. Ensure it is set up to make API calls to the backend. Modify the base URL for API requests in your React code to match the backend's URL.

2. **Run the Frontend**  
   From the root of the project, navigate to the `src` folder and start the React development server:  
   ```bash
   yarn start
   ```
   The frontend will run on `http://localhost:3000`.

---

## Running the Application

Once both the backend and frontend are set up, you can run both servers:

1. Start the backend:  
   ```bash
   cd api
   node index.js
   ```

2. Start the frontend:  
   ```bash
   cd src
   yarn start
   ```

- The frontend will run on `http://localhost:3000`.  
- The backend will run on `http://localhost:4070`.

---

## Database Setup

1. **MongoDB Configuration**  
   - Create a MongoDB cluster.  
   - Create a database user with a username and password.  
   - Obtain your MongoDB connection string and use it in your backend configuration.

2. **Database Connection Troubleshooting**  
   - **Check Connection String:** Ensure it is correctly formatted and free of typos.  
   - **Database User Password:** Ensure the password is not wrapped in `<` and `>` characters.  

---

## Troubleshooting

1. **Port Conflicts**  
   If the port is already in use, modify the port in your backend or frontend configuration.  

2. **Database Connection Issues**  
   Verify your connection string, database name, and credentials.


