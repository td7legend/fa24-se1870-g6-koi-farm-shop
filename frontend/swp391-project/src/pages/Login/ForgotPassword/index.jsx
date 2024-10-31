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
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../components/language/LanguageSelector";

const ForgotPassword = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const { t } = useTranslation();
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
            toast.success(t("otpSentSuccessfully"));
            setOtpModalOpen(true);
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
      setError(t("pleaseEnterYourEmail"));
      setSuccessMessage("");
      return;
    }

    if (!validateEmail(email)) {
      setError(t("pleaseEnterAValidEmailAddress"));
      setSuccessMessage("");
      return;
    }

    const code = await checkAccount_api();
    if (code === "ERR_BAD_REQUEST") {
      try {
        await generateAndSendOtp();
      } catch (error) {
        toast.error(t("failedToSendOtp") + error.message);
        return;
      }
    } else {
      setError(t("emailAccountNotRegistered"));
      return;
    }
  };

  const handleResetPass = async (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    setError(""); // Reset error message

    if (!validatePassword(password)) {
      setError(t("passwordValid"));
      return; // Dừng xử lý tiếp theo nếu có lỗi
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
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
        toast.success(t("passwordResetSuccessfully"));
        navigate("/login");
      } else {
        toast.error(t("passwordResetFailed"));
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const verifyOtp = () => {
    if (Date.now() > otpExpiry) {
      setOtpMessage(t("otpExpired"));
      return;
    }

    if (otpInput === otp) {
      toast.success(t("otpVerifiedSuccessfully"));
      setOtpModalOpen(false);
      setIsVerified(true);
      setOtpMessage("");
    } else {
      setOtpMessage(t("invalidOtp"));
    }
  };

  const resendOtp = async () => {
    if (Date.now() > otpExpiry) {
      try {
        await generateAndSendOtp();
        toast.success(t("newOtpSentSuccessfully"));
        setOtpMessage(""); // Reset the OTP message
      } catch (error) {
        toast.error(t("failedToSendNewOtp") + error.message);
      }
    } else {
      toast.error(t("pleaseWaitBeforeRequestingANewOtp"));
    }
  };

  const goBackToLogin = () => {
    navigate("/login");
  };
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  return (
    <>
      <div
        className="language-container"
        style={{ position: "relative", zIndex: 1000 }}
      >
        <LanguageSelector />
      </div>
      <div className="page__container">
        <div className="container">
          <div className="form-container forgot-password">
            <form
              onSubmit={isVerified ? handleResetPass : handleForgotPassword}
            >
              {isOtpModalOpen ? (
                <div className="otp-section">
                  <h2>{t("inputOtp")}</h2>
                  <label htmlFor="otpInput">
                    {t("pleaseEnterTheOtpSentToYourEmail")}
                  </label>
                  <input
                    id="otpInput"
                    type="text"
                    placeholder={`${t("inputOtp")} (${remainingTime} ${t(
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
                      {t("verifyOtp")}
                    </button>
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={isResendDisabled}
                      className="otp-button resend-button"
                    >
                      {t("resendOtp")}
                    </button>
                  </div>
                  {otpMessage && <p className="otp-message">{otpMessage}</p>}
                </div>
              ) : isVerified ? (
                <div className="inputPassword">
                  <label htmlFor="password">
                    {t("pleaseEnterYourNewPassword")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="confirmPassword">
                    {t("pleaseEnterConfirmPassword")}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="submit">{t("submit")}</button>
                  {error && <p className="error-message">{error}</p>}
                </div>
              ) : (
                <>
                  <h1>{t("forgotPassword")}</h1>
                  <div className="warning-icon">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                  </div>
                  <span>{t("enterYourEmailToResetYourPassword")}</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="submit-button">
                    {t("submit")}
                  </button>
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
                <h1>{t("haveAnAccount")}</h1>
                <p>{t("enterYourPersonalDetailsToUseAllOfSiteFeatures")}</p>
                <button className="hidden" onClick={goBackToLogin}>
                  {t("backToLogin")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
