import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Profile from "./Profile.jsx";
import TaskForm from "./TaskForm.jsx";
import Navbar from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import History from './History.jsx';
import { ToastContainer } from "react-toastify";
import './index.css';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthRoute from './AuthRoute.jsx';
import Footer from './footer.jsx';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBGrPfDOtdf8hkBKQIQ58jok9RKot2sWHQ",
//   authDomain: "tp2-web2-cfdde.firebaseapp.com",
//   projectId: "tp2-web2-cfdde",
//   storageBucket: "tp2-web2-cfdde.firebasestorage.app",
//   messagingSenderId: "804559092179",
//   appId: "1:804559092179:web:64f4ed5953a9668453d726"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export const googleProvider = new GoogleAuthProvider();
// export const facebookProvider = new FacebookAuthProvider();

const MainApp = () => {
  const location = useLocation();

  // Liste des routes où la Navbar ne doit pas apparaître
  const noNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      {/* Condition pour afficher la Navbar uniquement sur les pages autorisées */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/task-form" element={<TaskForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <MainApp />
    </Router>
  </React.StrictMode>
);
