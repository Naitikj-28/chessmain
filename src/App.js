import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Components/Navbar';
import Sign from './Components/Sign';
import Table from './Components/Table';
import Profile from './Components/Profile';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<Sign onSignIn={handleSignIn} />} />
        <Route path="/table" element={isSignedIn ? <Table /> : <Navigate to="/sign-in" />} />
        <Route path="/" element={<Navigate to={isSignedIn ? "/table" : "/sign-in"} />} />
      </Routes>
    </Router>
  );
}

export default App;
