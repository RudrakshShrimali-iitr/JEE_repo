Full Stack Online Exam System

Table of Contents

Introduction

Features

User Features (Student)

Admin Features

Technology Stack

Setup Instructions

Working Flow

User Flow

Admin Flow

User Roles

Project Structure

Dependencies

Flowcharts

Future Enhancements

Conclusion

Introduction

This project is a Full Stack Online Exam System designed to facilitate both students and administrators. Students can sign up, take exams, and review their performance, while administrators can manage questions, analyze results, and handle feedback. The system is built using modern technologies like React + Vite, TypeScript, Tailwind CSS, MongoDB, and JWT Token Authentication for a seamless and secure experience.

Features

User Features (Student)

Sign Up & Login: Secure authentication using JWT tokens.

Color-coded Question Navigation:

Green: Answered & Saved

Grey: Not Visited

Red: Not Answered

Purple: Marked for Review

Subject-wise Question Display: Questions are categorized by subject.

Countdown Timer: 3-hour timer for exam completion.

Download Question Paper: Option to download the question paper.

Change Language Option: Supports multiple languages.

Result & Performance Analysis:

Subject-wise and overall marks.

Percentage calculation.

Time analysis for each question.

Performance insights and improvement suggestions.

Admin Features

Admin Login: Secure login for administrators.

Question Upload & Management: Upload and manage questions in the database.

Result Management: View and analyze student results.

Feedback Handling: Review and respond to user feedback.

Technology Stack

Frontend

React + Vite: For building a fast and scalable user interface.

TypeScript: For type-safe and maintainable code.

Redux: For state management.

Tailwind CSS: For styling.

Backend

Node.js (Express.js): For building the RESTful API.

MongoDB: For database management.

Other Tools

JWT (JSON Web Tokens): For secure user authentication.

Axios: For API calls.

Setup Instructions

1. Clone the Repository

git clone https://github.com/JEE_repo.git
cd JEE_repo

2. Install Dependencies

Frontend:

cd frontend
npm install

Backend:

cd backend
npm install

3. Set Up Environment Variables

Create a .env file in both frontend and backend directories.

Frontend:

VITE_API_BASE_URL=http://localhost:5174

Backend:

PORT=4000
MONGODB_URI=mongodb+srv://rudrakshs:rudrakshs@jee.bymdn.mongodb.net/UserNames

4. Start the Server

Backend:

cd backend
npm start

Frontend:

cd frontend
npm run dev

5. Access the Application

Frontend: Open http://localhost:5174 in your browser.

Backend API: Runs on http://localhost:4000.

Working Flow

User Flow

Sign Up/Login: Users register and log in using JWT-based authentication.

Exam Page:

Users see subject-wise questions with color-coded navigation.

A 3-hour countdown timer starts automatically.

Users can mark questions for review, skip, or save answers.

Submission & Result Analysis:

After submission, users receive a detailed result breakdown.

Includes subject-wise marks, percentage, time analysis, and performance insights.

Admin Flow

Login: Admins log in securely.

Upload Questions: Admins can upload and manage questions.

Manage Results: View and analyze student results.

Handle Feedback: Review and respond to user feedback.

User Roles

Student

Takes exams.

Reviews performance analysis.

Submits feedback.

Admin

Manages question papers.

Analyzes and manages results.

Handles user feedback.

Project Structure

root-folder/
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/ (Redux)
│   │   ├── types/ (TypeScript types)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── public/
│   ├── package.json
│
│── backend/
│   ├── routes/
│   ├── models/ (MongoDB models)
│   ├── controllers/
│   ├── middleware/ (JWT authentication)
│   ├── server.ts
│   ├── config/
│   ├── package.json
│
│── .env
│── README.md

Dependencies

Frontend

React + Vite: Core framework.

TypeScript: For type safety.

Tailwind CSS: For styling.

Redux: For state management.

Axios: For API calls.

Backend

Express.js: For building the API.

MongoDB: For database management.

JWT: For authentication.

Flowcharts

1. User Flow

[Sign Up/Login] → [Exam Page] → [Answer Questions] → [Submit Exam] → [View Results]

2. Admin Flow

[Login] → [Upload Questions] → [Manage Results] → [Analyze Feedback]

Future Enhancements

AI-based Exam Analysis:

Detect cheating using AI.

Automatic scoring for subjective questions.

Live Exam Monitoring:

Real-time monitoring of active exams.

Auto-generated Reports:

Generate detailed reports for teachers.

More Question Types:

Support for MCQs, code compilers, and essay-type questions.

Conclusion

This Full Stack Online Exam System provides a seamless and secure platform for students to take exams and for administrators to manage and analyze results. Built with React + Vite, TypeScript, Tailwind CSS, MongoDB, and JWT Authentication, the project is scalable, maintainable, and ready for future enhancements.

Created by: Rudraksh Shrimali

GitHub Repository: https://github.com/RudrakshShrimali-iitr/JEE_repo/tree/main/project
Demo GIF link:https://media-hosting.imagekit.io//cec2589044da4f18/Demo.mp4?Expires=1833812759&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2EIB-ci76uH0-RbaUw1SNvEuldEVoD5-g25FgNoH5I2Mkf-AAn5D4RHhoGJuIYtWpyu9GoM-hVI0IdS6kYdTHXbU4pgkFEMPzxwEeDjQ-xL3qn3uJSdQPPqdF0SZ2q~d~v6Ksi0uUxOks9wDki6lF1meHfet38-jZbASunn9OShen40UDjCfXazMhp73A933H~A~1OEv~8jHIgot5N3sv0e9qH~1~XkoMQ8WBMPMExDVIwUu4~99P0HVmGsKx~2H-Pg30qmdegvO27H0zxzpWKNCxbQQHF9LTDv9Pr~GAD6DBRRPyDldlDauon8DGoq2Bbl8mMMJy-ACQIkdOSxP7w__


