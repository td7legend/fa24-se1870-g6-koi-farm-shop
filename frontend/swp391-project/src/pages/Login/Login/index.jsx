// src/components/Login/index.js
import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import axios from "axios"; // For HTTP requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons"; // Import the specific icons you need

const Main = ({
  active,
  setActive,
  error,
  setError,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  confirmPassword,
  setConfirmPassword,
  handleLogin,
  handleRegister,
}) => (
  <main>
    <div className={`container ${active ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className="social-icons">
            {/* Custom Google Sign-Up Button */}
            <button type="button" className="google-btn">
              <FontAwesomeIcon icon={faGooglePlusG} />
            </button>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-icons">
            {/* Custom Google Sign-In Button */}
            <button type="button" className="google-btn">
              <FontAwesomeIcon icon={faGooglePlusG} />
            </button>
          </div>

          <span>or use your email for login</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link to="/forgot-password">Forgot your password?</Link>
          <button type="submit">Sign In</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site features</p>
            <button className="hidden" onClick={() => setActive(false)}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of the site
              features
            </p>
            <button className="hidden" onClick={() => setActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
);

const LoginPage = () => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Email validation
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Password validation: At least 6 characters, one uppercase, one number, one special character
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  // Handle Login Form Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    const loginAPI = "https://api.yourdomain.com/login";

    try {
      const response = await axios.post(
        loginAPI,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.success) {
        console.log("Login Token: ", data.token); // Log the token to the console
        localStorage.setItem("token", data.token); // Store the token
        alert("Login successful");
        // Handle successful login (e.g., store tokens, redirect)
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  // Handle Register Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setError("");
    const registerAPI = "https://api.yourdomain.com/register"; // Replace with your actual register API endpoint

    try {
      const response = await axios.post(
        registerAPI,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.success) {
        console.log("Registration Token: ", data.token); // Log the registration token to the console
        alert("Registration successful");
        // Optionally, switch to sign-in form or redirect
        setActive(false);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <div className="page__container">
      <Main
        active={active}
        setActive={setActive}
        error={error}
        setError={setError}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default LoginPage;
