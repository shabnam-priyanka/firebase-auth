import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';



firebase.initializeApp(firebaseConfig);



function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    phone: '',
    error: '',
    success: 'false'
  })




  const provider = new firebase.auth.GoogleAuthProvider();
  const fbprovider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signInUser)
        console.log(displayName, photoURL, email);
      })
      .catch(error => {
        console.log(error);
      })
  }


  const handleFBLogin = () => {
    firebase.auth().signInWithPopup(fbprovider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handleSignOut = () => {

    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignIn: false,

          name: '',
          email: '',
          password: '',
          photo: ''
        }
        setUser(signOutUser)
        console.log(res);
      })
      .catch(err => {

      })
  }



  const handleBlur = (event) => {
    let isFieldValid = true;
    if (event.target.name === 'email') {
      const isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {

    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name)
        })
        .catch(error => {
          // Handle Errors here.
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          //console.log(newUserInfo);
          // ...

        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', res.user);
        })
        .catch(function (error) {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    event.preventDefault();
  }

  const updateUserName = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log('user name updated successfully');
    }).catch(function (error) {
      console.log(error);
    });
  }


  return (
    <div className='App'>
      {
        user.isSignedIn ? <button onClick={handleSignOut} > Sign out</button> :
          <button onClick={handleSignIn}>sign in</button>
      }
      <br/>
    <button onClick={handleSignIn} >Sign in using Facebook</button>


      {
        user.isSignedIn &&
        <div>
          <p>Welcome,{user.name}  </p>
          <p>your: email:{user.email} </p>
          <img src={user.photo} alt=''></img>
        </div>
      }
      <h1>Our own Authentication </h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit} >
        {newUser && <input type='text' name='name' onBlur={handleBlur} placeholder='your name' />}
        <br />
        <input type='text' name='email' onBlur={handleBlur} placeholder='Email address' required />
        <br />
        <input type='password' name='password' onBlur={handleBlur} id='' placeholder='password' required />
        <br />
        <input type='submit' value= {newUser ? 'Sign up' : 'Sign in' } />
      </form>

      <p style={{ color: 'red' }} >{user.error} </p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged In'} successfully </p>}
    </div>
  );
}

export default App;
