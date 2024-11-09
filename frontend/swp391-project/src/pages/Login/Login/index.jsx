import React, { useEffect, useState } from "react";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import config from "../../../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import LanguageSelector from "../../../components/language/LanguageSelector";
import { useTranslation } from "react-i18next";
import {
  faEnvelope,
  faLock,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
  t,
  showPassword,
  setShowPassword,
  togglePasswordVisibility,
}) => (
  <main>
    <div className={`container ${active ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          {!isOtpModalOpen ? (
            <>
              <h1>{t("createAccount")}</h1>

              <span>{t("useYourEmailForRegistration")}</span>
              <div className="input-container">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="name">{t("name")}</label>
              </div>
              <div className="input-container">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">{t("email")}</label>
              </div>
              <div className="input-container">
                <FontAwesomeIcon
                  icon={showPassword ? faUnlock : faLock}
                  className="input-icon"
                  onClick={togglePasswordVisibility}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <label htmlFor="password">{t("password")}</label>
              </div>
              <div className="input-container">
                <FontAwesomeIcon
                  icon={showPassword ? faUnlock : faLock}
                  className="input-icon"
                  onClick={togglePasswordVisibility}
                />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
              </div>

              <button type="submit">{t("signUp")}</button>
            </>
          ) : (
            <div className="otp-section">
              <h2>{t("inputOTP")}</h2>
              <label htmlFor="otpInput">
                {t("pleaseEnterTheOTPSentTo")} {email}
              </label>
              <input
                id="otpInput"
                type="text"
                placeholder={`${t("inputOTP")} (${remainingTime} ${t(
                  "remaining"
                )})`}
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
                  {t("verifyOTP")}
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isResendDisabled}
                  className="otp-button resend-button"
                >
                  {t("resendOTP")}
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
          <h1>{t("signIn")}</h1>
          <div className="social-icons">
            <button
              type="button"
              className="google-btn"
              onClick={handleLoginGoogle}
            >
              <FontAwesomeIcon icon={faGooglePlusG} />
            </button>
          </div>

          <span>{t("orUseYourEmailForLogin")}</span>
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">{t("email")}</label>
          </div>
          <div className="input-container">
            <FontAwesomeIcon
              icon={showPassword ? faUnlock : faLock}
              className="input-icon"
              onClick={togglePasswordVisibility}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">{t("password")}</label>
          </div>
          <Link to="/forgot-password">{t("forgotYourPassword")}</Link>
          <button type="submit">{t("signIn")}</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>{t("welcomeBack")}</h1>
            <p>{t("enterYourPersonalDetailsToUseAllOfSiteFeatures")}</p>
            <button className="hidden" onClick={() => setActive(false)}>
              {t("signIn")}
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>{t("helloFriend")}</h1>
            <p>{t("registerWithYourPersonalDetailsToUseAllOfSiteFeatures")}</p>
            <button className="hidden" onClick={() => setActive(true)}>
              {t("signUp")}
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(""); // <-- Added this state for OTP
  const [otpExpiry, setOtpExpiry] = useState(0); // <-- Added this state for OTP expiry
  const [otpInput, setOtpInput] = useState("");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    // Kiểm tra xem đã có token đăng nhập hay chưa
    if (isLoggedIn) {
      // Nếu đã đăng nhập, điều hướng về trang chủ
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("pleaseFillInBothEmailAndPassword"));
      return;
    }
    if (!validateEmail(email)) {
      toast.error(t("pleaseEnterAValidEmailAddress"));
      return;
    }
    if (!validatePassword(password)) {
      toast.error(t("pleaseEnterAValidPassword"));
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
        navigate(`/LoginSuccess/${data.token}`, { replace: true });
        toast.success(t("loginSuccessfully"));
      } else {
        toast.error(data.message || t("invalidLoginCredentials"));
      }
    } catch (error) {
      toast.error(t("incorrectEmailOrPassword") + error.message);
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
          publicKey: config.publicKey,
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
          },
          (error) => {
            toast.error(t("failedToSendOtp") + error.message);
          }
        );
    } catch (error) {
      toast.error(t("failedToSendOtp") + error.message);
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
      toast.error(t("pleaseFillInAllFields"));
      return;
    }
    if (!validatePassword(password)) {
      toast.error(t("passwordValid"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    setError("");
    try {
      const response = await axios.get(`${config.API_ROOT}auth/check-email`, {
        params: { email: email },
      });
      const data = response.data;
      console.log(data);

      // Nếu tài khoản chưa tồn tại, tiếp tục gửi OTP
      await generateAndSendOtp();
      toast.success(t("otpSentSuccessfully"));
      setOtpModalOpen(true);
    } catch (error) {
      console.log(error);
      const message = error.response.data;
      if (message === "Email already exists.") {
        toast.error(message);
      } else {
        toast.error(t("anErrorOccurred") + error.message);
      }
    }
  };

  const verifyOtp = async () => {
    if (otpInput === otp && Date.now() < otpExpiry) {
      toast.success(t("otpVerifiedSuccessfully"));
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

        const responseBody = response.data;
        console.log("Response Body:", responseBody);

        if (responseBody === "Customer registered successfully.") {
          toast.success(t("registrationSuccessful"));
          setActive(false);
        } else {
          toast.error(t("registrationFailed"));
        }
      } catch (error) {
        toast.error(t("anErrorOccurred") + error.message);
      }
    } else {
      toast.error(t("invalidOtp"));
    }
  };

  const resendOtp = async () => {
    if (Date.now() > otpExpiry) {
      try {
        await generateAndSendOtp();
        toast.success(t("newOTPSentSuccessfully"));
      } catch (error) {
        toast.error(t("cannotSendNewOTP") + error.message);
      }
    } else {
      toast.error(t("pleaseWaitBeforeRequestingANewOTP"));
    }
  };
  const LoginGoogle_api = `${config.API_ROOT}auth/login/google`;

  const handleLoginGoogle = async () => {
    try {
      const response = await axios.get(LoginGoogle_api);

      const url = response.data.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to get login URL: " + error.message);
      }
    } catch (error) {
      console.error("An error occurred: " + error.message);
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
        t={t}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
