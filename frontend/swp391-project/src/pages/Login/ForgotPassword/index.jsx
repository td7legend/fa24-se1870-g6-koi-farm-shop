import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
// API call function (same as in login)
const callApi = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.success) {
      return { success: true, message: data.message || "Success" };
    } else {
      return {
        success: false,
        message: data.message || "Something went wrong.",
      };
    }
  } catch (error) {
    return { success: false, message: "An error occurred: " + error.message };
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      setSuccessMessage("");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    setError("");

    // Call API to request password reset
    const result = await callApi(
      "https://api.yourdomain.com/forgot-password",
      "POST",
      {
        email,
      }
    );

    if (result.success) {
      setSuccessMessage("Password reset link has been sent to your email.");
      setError("");
    } else {
      setError(result.message);
      setSuccessMessage("");
    }
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="page__container">
      <div className="container">
        <div className="form-container forgot-password">
          <form onSubmit={handleForgotPassword}>
            <h1>Forgot Password</h1>
            <div className="warning-icon">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </div>
            <span>
              Enter your email, and we will send you a link to reset your
              password.
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Submit</button>
            {error && <p className="error-message">{error}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h1>Have an account!</h1>
              <p>Enter your personal details to use all of site features.</p>
              <button className="hidden" onClick={goBackToLogin}>
                Back To Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
