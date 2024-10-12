import React, { useState } from "react";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import config from "../../../config/config";

const OtpModal = ({
  isOpen,
  onClose,
  otp,
  otpInput,
  setOtpInput,
  verifyOtp,
  resendOtp,
  remainingTime,
  isResendDisabled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nhập OTP</h2>
        <input
          type="text"
          placeholder={`Nhập OTP (còn ${remainingTime} giây)`}
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          required
        />
        <button type="button" onClick={verifyOtp}>
          Xác thực OTP
        </button>
        <button type="button" onClick={resendOtp} disabled={isResendDisabled}>
          Gửi lại OTP
        </button>
        <button type="button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

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
}) => (
  <main>
    <div className={`container ${active ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
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
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
  const [otp, setOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(null);
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
      setError("Please fill in both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    const loginAPI = `${config.API_ROOT}User/login`;

    try {
      const response = await axios.post(
        loginAPI,
        { username: email, password: password },
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
        alert("Login successful");
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  const sendOtpEmail = async (otp) => {
    try {
      await emailjs
        .send("service_a1o085u", "template_1gbuioi", {
          user_name: name,
          user_email: email,
          otp_code: otp,
          reply_to: "khoakhoatran20.m@gmail.com",
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
          },
          (error) => {
            console.log("FAILED...", error);
          }
        );
    } catch (error) {
      setError("Failed to send OTP: " + error.message);
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
  const api_register = `${config.API_ROOT}User/register-customer`;
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !address || !email || !password || !confirmPassword) {
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
    try {
      await generateAndSendOtp();
      alert("OTP đã được gửi thành công!");
    } catch (error) {
      setError("Không thể gửi OTP: " + error.message);
    }
  };

  const verifyOtp = async () => {
    if (otpInput === otp && Date.now() < otpExpiry) {
      alert("OTP verified successfully!");
      setOtpModalOpen(false);
      try {
        const response = await axios.post(
          api_register,
          {
            username: email,
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
          alert("Đăng ký thành công!");
          setActive(false); // Chuyển sang form đăng nhập
        } else {
          setError("Đăng ký không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        setError("An error occurred: " + error.message);
      }
    } else {
      setError("Invalid or expired OTP. Please try again.");
    }
  };

  const resendOtp = async () => {
    if (Date.now() > otpExpiry) {
      try {
        await generateAndSendOtp();
        alert("OTP mới đã được gửi thành công!");
      } catch (error) {
        setError("Không thể gửi OTP mới: " + error.message);
      }
    } else {
      setError("Vui lòng đợi trước khi yêu cầu OTP mới.");
    }
  };
  const LoginGoogle_api = `${config.API_ROOT}User/login/google`;

  const handleLoginGoogle = async () => {
    try {
      const response = await axios.get(LoginGoogle_api);
      const url = response.data.url;
      console.log(url);
      if (url) {
        // Sử dụng window.location.href cho URL bên ngoài
        // window.location.href = url;
      } else {
        console.error("Không nhận được URL xác thực từ server");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi bắt đầu đăng nhập Google:", error);
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
      />
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        otp={otp}
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
