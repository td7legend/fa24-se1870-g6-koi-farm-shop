import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../../../store/actions/authActions";

const LoginSuccess = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(token);
  useEffect(() => {
    if (token) {
      dispatch(login(token));
      navigate("/", { replace: true });
    }
  }, [dispatch, token, navigate]);

  return null;
};
export default LoginSuccess;
