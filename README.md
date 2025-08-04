#  Pro-Tasker - Project & Task Management App

**Pro-Tasker** is a full-stack web application that allows users to create and manage projects and tasks, invite collaborators, and stay organized with a clean, modern interface.

>  This project is my final capstone for the software engineering program. It demonstrates my ability to build and deploy a complete MERN (MongoDB, Express, React, Node) stack application from scratch, including authentication, REST API, state management, and deployment.

---

##  Live Project Links

- **Frontend (Vercel)**  [https://pro-tasker-black.vercel.app](https://pro-tasker-black.vercel.app)  
- **Backend (Render)**  [https://pro-tasker.onrender.com](https://pro-tasker.onrender.com)

---

##  Main Features

-  User registration and secure login with JWT  
-  Create and manage multiple projects  
-  Add, update, and delete tasks per project  
-  Collaborator invitation system (basic version)  
-  Fully responsive design using Tailwind CSS  
-  Summer-inspired color palette for modern UI  
-  Deployed and accessible from anywhere

---

## Tech Stack

### Frontend

- **React** with **Vite** for fast builds
- **Tailwind CSS** for modern UI design
- **React Router** for client-side routing
- **Custom hooks** and **context API** for state management

### Backend

- **Node.js** with **Express**
- **MongoDB** using **Mongoose**
- **JWT** for secure authentication
- **Bcrypt** for password encryption
- **RESTful API** structure
- **CORS config** to allow secure frontend-backend communication

---

##  Folder Structure

### Backend

tasker-backend/
│
├── controllers/ # Logic for users, projects, tasks
├── routes/ # API endpoints
├── models/ # Mongoose schemas
├── middleware/ # Authentication, ownership checks
├── config/ # MongoDB connection
└── server.js # App entry point


### Frontend


tasker-frontend/
│
├── pages/ # Pages like Login, Register, Dashboard
├── components/ # Reusable UI components
├── context/ # Auth context
├── hooks/ # useApi, useLogin, etc.
└── App.jsx # Main routing and layout


---

##  Environment Variables

### Backend - `.env`
 
 
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=https://pro-tasker-black.vercel.app


### Frontend - `.env.production`

VITE_API_BASE_URL=https://pro-tasker.onrender.com


---

##  Testing Summary

- ✔ Registration and login tested (with valid/invalid data)
- ✔ JWT token is stored and used in headers
- ✔ Project CRUD tested (create, edit, delete)
- ✔ Task CRUD tested (nested under projects)
- ✔ Errors and edge cases handled with appropriate messages
- ✔ Deployed versions tested on different devices and browsers

---

##  What I Learned

- Building a complete MERN stack app from scratch
- Structuring RESTful APIs and modular backend code
- Implementing JWT authentication and route protection
- Handling CORS and environment variables for deployment
- Designing with Tailwind CSS and building reusable components
- Deploying apps using **Render** (backend) and **Vercel** (frontend)
- Troubleshooting cross-origin issues in production
- Debugging deployment and network errors

---

##  Future Improvements

-  Add real-time collaboration using WebSockets
-  Add password reset via email
-  Add user profile page
-  Add analytics or task status tracking
-  Integrate calendar view for tasks

---


##  About Me

I’m a software developer with an engineering background in energy and a passion for building accessible and elegant web applications. I'm actively looking for opportunities as a **junior backend or full-stack developer**.

 Feel free to contact me on [LinkedIn](https://www.www.linkedin.com/inm) or by email.


