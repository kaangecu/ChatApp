import './App.css';
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { isAuthenticated, isAdmin } from './utils/auth';
import Login from './pages/Login'
import Chat from './pages/Chat'


function App() {
  const [username ,setUsername ] = useState("");

  return(
    <>
      {username ==="" ? <Login setUsername={setUsername}/> : <Chat username={username} setUsername={setUsername}/> }
    </>
  )
}

export default App;
