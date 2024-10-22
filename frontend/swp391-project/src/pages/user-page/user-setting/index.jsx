import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { Breadcrumb, Button, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faTag,
  faShoppingCart,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/authActions";
import { AES, enc } from "crypto-js";
import config from "../../../config/config";
const DEFAULT_AVATAR =
  "https://ih1.redbubble.net/image.3771768892.4974/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";

const UserSetting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    tier: 0,
    pointAvailable: 0,
    usedPoint: 0,
    accommodatePoint: 0,
  });
  const [initialUserForm, setInitialUserForm] = useState({});
  const [isUserFormChanged, setIsUserFormChanged] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordFormChanged, setIsPasswordFormChanged] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const decryptedToken = token
    ? AES.decrypt(token, config.SECRET_KEY).toString(enc.Utf8)
    : null;
  const decryptedRole = role
    ? parseInt(AES.decrypt(role, config.SECRET_KEY).toString(enc.Utf8))
    : 0;
  useEffect(() => {
    console.log("token ", token);
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!token) {
          toast.error("No authentication token found. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${decryptedToken ?? null}` },
          }
        );
        const userInfo = response.data;
        console.log("User Info received from API:", userInfo);
        const formData = {
          fullName: userInfo.fullName || "",
          phoneNumber: userInfo.phoneNumber || "",
          address: userInfo.address || "",
          tier: userInfo.tier || 0,
          pointAvailable: userInfo.pointAvailable || 0,
          usedPoint: userInfo.usedPoint || 0,
          accommodatePoint: userInfo.accommodatePoint || 0,
        };
        setUserForm(formData);
        setInitialUserForm(formData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/login");
        } else {
          toast.error(
            "An error occurred while fetching data. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    decryptedToken && fetchData();
  }, [decryptedToken, dispatch, navigate]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(userForm) !== JSON.stringify(initialUserForm);
    setIsUserFormChanged(hasChanged);
  }, [userForm, initialUserForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const phoneNumber = value.replace(/\D/g, "").slice(0, 10);
      setUserForm((prev) => ({ ...prev, [name]: phoneNumber }));
    } else {
      setUserForm((prev) => ({
        ...prev,
        [name]:
          name === "tier" ||
          name === "pointAvailable" ||
          name === "usedPoint" ||
          name === "accommodatePoint"
            ? Number(value)
            : value,
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsPasswordFormChanged(true);
  };

  const handleValidationErrors = (errors) => {
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
  };

  const validateForm = () => {
    if (!userForm.fullName.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (userForm.phoneNumber.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!userForm.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    return true;
  };

  const saveUserInfo = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const updatedUser = {
        name: userForm.fullName,
        phone: userForm.phoneNumber,
        address: userForm.address,
      };

      await axios.put(`${config.API_ROOT}customers/my-info`, updatedUser, {
        headers: { Authorization: `Bearer ${decryptedToken ?? null}` },
      });

      toast.success("User information updated successfully!");
      setInitialUserForm(userForm);
      setIsUserFormChanged(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.errors
      ) {
        handleValidationErrors(error.response.data.errors);
      } else {
        toast.error(`Failed to update user information: ${error.message}`);
      }
    }
  };

  const savePasswordInfo = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${config.API_ROOT}auth/change-password`,
        {
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${decryptedToken ?? null}` },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsPasswordFormChanged(false);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error("Old password is incorrect. Please try again.");
            break;
          case 400:
            if (error.response.data.errors) {
              handleValidationErrors(error.response.data.errors);
            } else {
              toast.error(
                "Invalid input. Please check your entries and try again."
              );
            }
            break;
          default:
            toast.error(
              `Failed to change password: ${
                error.response.data.message || "Unknown error occurred"
              }`
            );
        }
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  const confirmLogout = () => {
    setShowConfirmation(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowConfirmation(false);
    navigate("/");
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="user-settings-layout">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=" > ">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon
              icon={faHome}
              style={{
                marginRight: "8px",
                verticalAlign: "middle",
                marginBottom: "5px",
              }}
            />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Account</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">Setting</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li onClick={() => navigate("/user-dashboard/:id")}>
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </li>
            <li onClick={() => navigate("/order-history")}>
              <FontAwesomeIcon icon={faClipboardList} /> Order History
            </li>
            <li onClick={() => navigate("/promotion")}>
              <FontAwesomeIcon icon={faTag} /> Promotion
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> Shopping Cart
            </li>
            <li className="active">
              <FontAwesomeIcon icon={faCog} /> Setting
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </aside>

        <main className="settings-content">
          <div className="settings-card">
            <h4>User Information</h4>
            <form onSubmit={saveUserInfo}>
              <div className="form-row">
                <div className="form-column">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userForm.fullName}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userForm.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter 10 digit number"
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userForm.address}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Tier</label>
                  <input
                    type="number"
                    name="tier"
                    value={userForm.tier}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Points Available</label>
                  <input
                    type="number"
                    name="pointAvailable"
                    value={userForm.pointAvailable}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Points Used</label>
                  <input
                    type="number"
                    name="usedPoint"
                    value={userForm.usedPoint}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Accommodate Point</label>
                  <input
                    type="number"
                    name="accommodatePoint"
                    value={userForm.accommodatePoint}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column avatar-section">
                  <img src={DEFAULT_AVATAR} alt="Avatar" className="avatar" />
                </div>
              </div>
              <button type="submit" disabled={!isUserFormChanged}>
                Save Changes
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h4>Password Settings</h4>
            <form onSubmit={savePasswordInfo}>
              <div className="form-row">
                <div className="form-column">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
              </div>
              <button type="submit" disabled={!isPasswordFormChanged}>
                Change Password
              </button>
            </form>
          </div>
        </main>
      </div>
      <ToastContainer />

      <Modal
        title="Confirm Logout?"
        visible={showConfirmation}
        onOk={handleLogout}
        onCancel={() => setShowConfirmation(false)}
        okText="Log out"
        cancelText="Cancel"
        footer={[
          <Button
            key="back"
            onClick={() => setShowConfirmation(false)}
            style={{ backgroundColor: "#C0C0C0", color: "black" }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleLogout}
            style={{ backgroundColor: "#bbab6f", color: "white" }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default UserSetting;
