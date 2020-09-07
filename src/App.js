import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';



firebase.initializeApp(firebaseConfig);




function App() {

const [user, setUser] = useState({
  isSignedIn: false,
  name:'', 
  email:'', 
  phone:''
})




  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const { displayName,photoURL, email} = res.user;
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser)
      console.log(displayName,photoURL, email);
    })
    .catch(error => {
      console.log(error);
    })
  }

   const handleSignOut = () => {

  firebase.auth().signOut()
  .then(res => {
    const signOutUser = {
      isSignIn: false,
      name: '',
      email: '',
      photo: ''
    }
    setUser(signOutUser)
    console.log(res);
  })
  .catch (err => {
    
  })
  }
  
  

  return (
    <div className='App'>
     {
      user.isSignedIn ? <button onClick={handleSignOut} > Sign out</button> :
      <button onClick={handleSignIn}>sign in</button>
     }
     
      {
        user.isSignedIn &&
        <div>
      <p>Welcome,{user.name}  </p>
      <p>your: email:{user.email} </p>
      <img src={user.photo} alt=''></img>
      </div>
      }
    </div>
  );
}

export default App;
