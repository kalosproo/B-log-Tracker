# B-log Tracker

B-log Tracker is a simple and efficient web-based attendance and work-time tracking application designed for daily real-world use.
It allows users to securely log work sessions, track active working time, and view day-wise summaries with total hours.

The application focuses on clarity, usability, and error prevention through a clean UI and smart state management.

---

## Key Features

- Secure authentication using Email/Password and Google Sign-In
- Check In / Check Out based work session tracking
- Automatic button state control to prevent invalid actions
- Live session status with a running timer
- Day-wise work summary with total working hours
- Support for multiple sessions per day
- Safe, date-wise deletion of logs
- Mobile-first, modern dark user interface

---

## UX Principles

- Clear visibility of system status (Active / Offline)
- Reduced cognitive load using controlled actions
- Error prevention through disabled states
- Scannable, date-grouped activity logs

---

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Firebase Authentication, Firebase Firestore

---

## Project Structure

index.html      - Application UI
style.css       - Styling and layout
script.js       - Application logic
firebase.js     - Firebase configuration
README.md

---

## Setup Instructions

1. Clone or download the repository
2. Create a Firebase project
3. Enable Authentication (Email/Password and Google)
4. Enable Firestore Database
5. Add your Firebase configuration to firebase.js
6. Open index.html in a modern browser (Chrome recommended)

---

## Firestore Rules (Development)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /logs/{logId} {
      allow read, write: if request.auth != null;
    }
  }
}

---

## Use Cases

- Personal daily work tracking
- Freelancers logging work hours
- Part-time job attendance
- Productivity and time analysis

---

## Author

Developed by Muttukuru Rahul 

This project emphasizes practical usability, clean UX, and incremental improvement over complexity.

---

## Disclaimer

This project is intended for personal and learning purposes.
Review and harden Firebase security rules before using in production environments.
