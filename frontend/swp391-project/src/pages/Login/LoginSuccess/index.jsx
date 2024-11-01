import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../../../store/actions/authActions";

const LoginSuccess = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(login(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (role) {
      if (role === "Customer") {
        navigate("/", { replace: true });
      } else if (role === "Staff") {
        navigate("/staff-dashboard", { replace: true });
      } else {
        navigate("/admin-dashboard", { replace: true });
      }
    }
  }, [role, navigate]);

  return null;
};

export default LoginSuccess;
