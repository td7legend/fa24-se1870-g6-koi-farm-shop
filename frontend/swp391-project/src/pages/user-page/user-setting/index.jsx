import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import uploadFile from "../../../utils/upload/upload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faTag,
  faShoppingCart,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UserSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [accountForm, setAccountForm] = useState({});
  const [addressForm, setAddressForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({});
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information?userID=${id}`
        );
        if (response.data.length > 0) {
          const userInfo = response.data[0];
          setUser(userInfo);
          setAccountForm(userInfo);
          setAddressForm(userInfo);
          setPreviewImage(userInfo.avatar_path || DEFAULT_AVATAR);
        }
      } catch (error) {
        toast.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    setFileList([file]);
    if (file) {
      const preview = await getBase64(file);
      setPreviewImage(preview);
    } else {
      setPreviewImage(user.avatar_path || DEFAULT_AVATAR);
    }
  };

  const handleUploadAvatar = async () => {
    if (fileList.length === 0) return null;
    const file = fileList[0];
    try {
      const url = await uploadFile(file);
      return url;
    } catch (error) {
      toast.error("Failed to upload avatar");
      throw error;
    }
  };

  const saveAccountInfo = async () => {
    try {
      let avatarUrl = user.avatar_path;
      if (fileList.length > 0) {
        avatarUrl = await handleUploadAvatar();
      }

      const updatedUser = {
        ...user,
        ...accountForm,
        avatar_path: avatarUrl,
      };

      await axios.put(
        `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information/${user.id}`,
        updatedUser
      );

      setUser(updatedUser);
      toast.success("Account Info updated successfully!");

      setFileList([]);
    } catch (error) {
      toast.error(`Failed to update Account Info: ${error.message}`);
    }
  };

  const saveAddressInfo = async () => {
    try {
      const updatedUser = {
        ...user,
        ...addressForm,
      };

      await axios.put(
        `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information/${user.id}`,
        updatedUser
      );
      setUser(updatedUser);
      toast.success("Address Info updated successfully!");
    } catch (error) {
      toast.error(`Failed to update Address Info: ${error.message}`);
    }
  };

  const savePasswordInfo = async () => {
    try {
      // Add password update API logic here
      toast.success("Password updated successfully!");
      setPasswordForm({});
    } catch (error) {
      toast.error(`Failed to update Password: ${error.message}`);
    }
  };

  // if (loading) {
  //   return <div className="loading-spinner">Loading...</div>;
  // }

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
          <h4>Navigation</h4>
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
            <li onClick={() => navigate("/logout")}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </aside>

        <main className="settings-content">
          <div className="settings-card">
            <h4>Account Settings</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAccountInfo();
              }}
            >
              <div className="form-row">
                <div className="form-column">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={accountForm.fullName || ""}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        fullName: e.target.value,
                      })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={accountForm.email || ""}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, email: e.target.value })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Phone</label>
                  <input
                    type="text"
                    value={accountForm.phone || ""}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, phone: e.target.value })
                    }
                    required
                    pattern="^[0-9]{10}$"
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Total Points</label>
                  <input
                    type="text"
                    value={accountForm.totalPoints || ""}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Points Available</label>
                  <input
                    type="text"
                    value={accountForm.pointAvailable || ""}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                  <label>Points Used</label>
                  <input
                    type="text"
                    value={accountForm.pointUsed || ""}
                    readOnly
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column avatar-section">
                  <img src={previewImage} alt="Avatar" className="avatar" />
                  <label htmlFor="avatar-upload" className="change-image-label">
                    Change Image
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <button type="submit">Save Change</button>
            </form>
          </div>

          {/* Address Info */}
          <div className="settings-card">
            <h4>Address Settings</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAddressInfo();
              }}
            >
              <div className="form-row">
                <div className="form-column">
                  <label>Address</label>
                  <input
                    type="text"
                    value={addressForm.address || ""}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address: e.target.value,
                      })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column">
                  <label>District</label>
                  <input
                    type="text"
                    value={addressForm.district || ""}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        district: e.target.value,
                      })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressForm.city || ""}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column">
                  <label>Ward</label>
                  <input
                    type="text"
                    value={addressForm.ward || ""}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, ward: e.target.value })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
              </div>
              <button type="submit">Save Change</button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="settings-card">
            <h4>Password Settings</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePasswordInfo();
              }}
            >
              <div className="form-row">
                <div className="form-column">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword || ""}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
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
                    value={passwordForm.newPassword || ""}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
                <div className="form-column">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword || ""}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    style={{ backgroundColor: "#fffaf0" }}
                  />
                </div>
              </div>
              <button type="submit">Change Password</button>
            </form>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserSetting;
