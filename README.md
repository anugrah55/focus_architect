# Focus Architect: Deep Work Environment

Focus Architect is a production-level React application acting as a minimalist deep work and goal management platform for knowledge workers.

## 🎯 Problem Statement
Standard to-do list apps organize *what* to do, but fail to measure the *quality* and *intensity* of execution. Knowledge workers often fall into "shallow work" masquerading as productivity.
**Focus Architect** forces users to define high-level **Missions** and log **Deep Work Sessions** where they track time spent, output achieved, and a self-rated "Focus Quality Score", visualizing peak productivity patterns over time.

## ✨ Features
- **Secure Authentication**: Firebase Email/Password auth mapped to a global React Context.
- **Dashboard**: High-level analytics utilizing `useMemo` for optimization of heavy calculations.
- **Mission Management (CRUD)**: Define long-term goals.
- **Session Tracking (CRUD)**: Log deep work tied directly to a specific mission.
- **Monochrome Design System**: High-contrast, clean UI maximizing whitespace to maintain deep focus.
- **Micro-animations**: Premium feel utilizing Framer Motion.

## 🛠️ Tech Stack
- **Frontend Core**: React (Vite)
- **Styling**: Tailwind CSS v4, clsx, tailwind-merge
- **Routing**: React Router v6
- **State Management**: React Context API, local state, React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`)
- **Backend (BaaS)**: Firebase (Auth & Firestore)
- **Animations**: Framer Motion

## 🚀 Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Head to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication** (Email/Password).
   - Enable **Firestore Database**.
   - Create a `.env` file in the root based on `.env.example` and add your config:
     ```env
     VITE_FIREBASE_API_KEY=your_key
     VITE_FIREBASE_AUTH_DOMAIN=your_domain
     VITE_FIREBASE_PROJECT_ID=your_id
     VITE_FIREBASE_STORAGE_BUCKET=your_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
     VITE_FIREBASE_APP_ID=your_app_id
     ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`.
