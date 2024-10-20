import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import config from "../../../config/config";
import axios from "axios";
import { initEmailJS } from "../../../config/emailjsConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [otpInput, setOtpInput] = useState("");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const sendOtpEmail = async (otp) => {
    try {
      await emailjs
        .send("service_ewtf80l", "template_90p3nrh", {
          user_email: email,
          message: `OTP to change your account's password is ${otp},The otp code will expire within 2 minutes`,
          reply_to: "goldenkoi.vn@gmail.com",
          publicKey: config.publicKey,
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            toast.success("OTP sent successfully!");
            setOtpModalOpen(true);
          },
          (error) => {
            toast.error("Failed to send OTP: " + error.message);
          }
        );
    } catch (error) {
      toast.error("Failed to send OTP: " + error.message);
    }
  };

  const generateAndSendOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(generatedOtp);
    setOtp(generatedOtp);
    setOtpExpiry(Date.now() + 2 * 60 * 1000);
    sendOtpEmail(generatedOtp);

    setRemainingTime(120);
    setIsResendDisabled(true);

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const checkAccount_api = async () => {
    setError("");
    try {
      const response = await axios.get(`${config.API_ROOT}auth/check-email`, {
        params: { email: email },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking email:", error);
      return error.code; // hoặc xử lý lỗi theo cách bạn muốn
    }
  };

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

    const code = await checkAccount_api();
    if (code === "ERR_BAD_REQUEST") {
      try {
        await generateAndSendOtp();
      } catch (error) {
        toast.error("Cannot send OTP: " + error.message);
        return;
      }
    } else {
      setError("Email account not registered");
      return;
    }
  };

  const handleResetPass = async (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    setError(""); // Reset error message

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character."
      );
      return; // Dừng xử lý tiếp theo nếu có lỗi
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return; // Dừng xử lý tiếp theo nếu có lỗi
    }

    try {
      const response = await axios.post(
        `${config.API_ROOT}auth/reset-password`,
        {
          email: email,
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error("Password reset failed!");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const verifyOtp = () => {
    if (Date.now() > otpExpiry) {
      setOtpMessage("OTP has expired. Please request a new one.");
      return;
    }

    if (otpInput === otp) {
      toast.success("OTP verified successfully!");
      setOtpModalOpen(false);
      setIsVerified(true);
      setOtpMessage("");
    } else {
      setOtpMessage("Invalid OTP. Please try again.");
    }
  };

  const resendOtp = async () => {
    if (Date.now() > otpExpiry) {
      try {
        await generateAndSendOtp();
        toast.success("New OTP sent successfully!");
        setOtpMessage(""); // Reset the OTP message
      } catch (error) {
        toast.error("Cannot send new OTP: " + error.message);
      }
    } else {
      toast.error("Please wait before requesting a new OTP.");
    }
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="page__container">
      <div className="container">
        <div className="form-container forgot-password">
          <form onSubmit={isVerified ? handleResetPass : handleForgotPassword}>
            {isOtpModalOpen ? (
              <div className="otp-section">
                <h2>Input OTP</h2>
                <label htmlFor="otpInput">
                  Please enter the OTP sent to your email.
                </label>
                <input
                  id="otpInput"
                  type="text"
                  placeholder={`Input OTP (${remainingTime} remaining)`}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                />
                <div className="otp-actions">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="otp-button"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isResendDisabled}
                    className="otp-button resend-button"
                  >
                    Resend OTP
                  </button>
                </div>
                {otpMessage && <p className="otp-message">{otpMessage}</p>}
              </div>
            ) : isVerified ? (
              <div className="inputPassword">
                <label htmlFor="password">
                  Please enter your new password.
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">
                  Please enter confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit">Submit</button>
                {error && <p className="error-message">{error}</p>}
              </div>
            ) : (
              <>
                <h1>Forgot Password</h1>
                <div className="warning-icon">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </div>
                <span>Enter your email to reset your password.</span>
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
              </>
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
