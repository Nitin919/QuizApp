import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './component/HomePage';
import Quiz from './component/Quiz';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard'; // Updated import for Dashboard
import QuizHistory from './component/QuizHistory';

function App() {
  const isUserLoggedIn = () => {
    return localStorage.getItem('token');
  };

  const isUserSignedUp = () => {
    return localStorage.getItem('userSignedUp'); // A flag to check if the user has signed up before
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isUserLoggedIn() 
            ? <HomePage /> 
            : (isUserSignedUp() ? <Navigate to="/login" /> : <Navigate to="/signup" />)
          } 
        />
        <Route path="/quiz" element={isUserLoggedIn() ? <Quiz /> : <Navigate to="/signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/QuizHistory" element={isUserLoggedIn() ? <QuizHistory /> : <Navigate to="/signup" />} />
        <Route path="/dashboard" element={isUserLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
