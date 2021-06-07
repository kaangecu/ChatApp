import React from 'react'
import Login from './Login'



function LoginScreen({isLogged}) {


  const addUser = (user) => {
    const newUser = {
      username: user.userName,
      password: user.password,
    }
    console.log(newUser) 
    isLogged(true);
  }
 
  return ( 
    <div> 
      <Login addUser={addUser}></Login>
    </div>
  );
}

export default LoginScreen;
