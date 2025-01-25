import React, { useState } from 'react';
import './Login.css';
import { auth, db } from '../../lib/firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import userSessionStore from '../../lib/userSessionStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const setUser = userSessionStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, username, password } = Object.fromEntries(formData);

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        moviesWatched: [],
        moviesReviewed: [],
        moviesLiked: [],
        reviews: []
      });

      toast.success("Account created successfully!");
      e.target.reset();  
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      setUser({ uid: user.uid, email: user.email });
      toast.success("Logged in successfully!");
      e.target.reset();  
      navigate('/homepage');
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="Register">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" name="email" required />
          <input type="text" placeholder="Username" name="username" required />
          <input type="password" placeholder="Password" name="password" required />
          <button type="submit" disabled={loading}>{loading ? "Loading..." : "Create Account"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
