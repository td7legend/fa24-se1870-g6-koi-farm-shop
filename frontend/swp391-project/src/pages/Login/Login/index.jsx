import React, { useState } from "react";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import config from "../../../config/config";
import { ToastContainer, toast } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

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
  address,
  setAddress,
  confirmPassword,
  setConfirmPassword,
  handleLogin,
  handleRegister,
  handleLoginGoogle,
  isOtpModalOpen,
  otpInput,
  setOtpInput,
  verifyOtp,
  resendOtp,
  remainingTime,
  isResendDisabled,
}) => (
  <main>
    <div className={`container ${active ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          {!isOtpModalOpen ? (
            <>
              <h1>Create Account</h1>
              <div className="social-icons">
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
            </>
          ) : (
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
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <button
              type="button"
              className="google-btn"
              onClick={handleLoginGoogle}
            >
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
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(""); // <-- Added this state for OTP
  const [otpExpiry, setOtpExpiry] = useState(0); // <-- Added this state for OTP expiry
  const [otpInput, setOtpInput] = useState("");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setError("");
    const loginAPI = `${config.API_ROOT}auth/login`;

    try {
      const response = await axios.post(
        loginAPI,
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.token) {
        navigate(`/LoginSuccess/${data.token}`);
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const sendOtpEmail = async (otp) => {
    try {
      await emailjs
        .send("service_ewtf80l", "template_24hvd4i", {
          user_name: name,
          user_email: email,
          otp_code: otp,
          reply_to: "goldenkoi.vn@gmail.com",
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
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
    setOtpModalOpen(true);
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

  const api_register = `${config.API_ROOT}auth/register`;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    setError("");
    try {
      await generateAndSendOtp();
      toast.success("OTP sent successfully!");

      setOtpModalOpen(true);
    } catch (error) {
      toast.error("Cannot send OTP: " + error.message);
    }
  };

  const verifyOtp = async () => {
    if (otpInput === otp && Date.now() < otpExpiry) {
      toast.success("OTP verified successfully!");
      setOtpModalOpen(false);
      try {
        const response = await axios.post(
          api_register,
          {
            email: email,
            password: password,
            fullName: name,
            address: address,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Lấy responseBody từ response
        const responseBody = response.data;
        console.log("Response Body:", responseBody);

        // Xử lý responseBody
        if (responseBody === "Customer registered successfully.") {
          toast.success("Registration successful!");
          setActive(false); // Chuyển sang form đăng nhập
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred: " + error.message);
      }
    } else {
      toast.error("Invalid or expired OTP. Please try again.");
    }
  };

  const resendOtp = async () => {
    if (Date.now() > otpExpiry) {
      try {
        await generateAndSendOtp();
        toast.success("New OTP sent successfully!");
      } catch (error) {
        toast.error("Cannot send new OTP: " + error.message);
      }
    } else {
      toast.error("Please wait before requesting a new OTP.");
    }
  };
  const LoginGoogle_api = `${config.API_ROOT}auth/login/google`;

  const handleLoginGoogle = async () => {
    try {
      const response = await axios.get(LoginGoogle_api);
      const url = response.data.url;
      console.log(url);
      if (url) {
        // Sử dụng window.location.href cho URL bên ngoài
        // window.location.href = url;
      } else {
        toast.error("No authentication URL received from the server.");
      }
    } catch (error) {
      toast.error("An error occurred while starting Google login: ", error);
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
        address={address}
        setAddress={setAddress}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLoginGoogle={handleLoginGoogle}
        isOtpModalOpen={isOtpModalOpen}
        otpInput={otpInput}
        setOtpInput={setOtpInput}
        verifyOtp={verifyOtp}
        resendOtp={resendOtp}
        remainingTime={remainingTime}
        isResendDisabled={isResendDisabled}
      />
    </div>
  );
};

export default LoginPage;
