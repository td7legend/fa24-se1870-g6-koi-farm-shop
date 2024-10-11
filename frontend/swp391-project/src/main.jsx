import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.scss";
import reduxStore from "./redux.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { initEmailJS } from "./config/emailjsConfig.js";
import { ToastContainer } from "react-toastify";

const { store, persistor } = reduxStore();
const root = ReactDOM.createRoot(document.getElementById("root"));
initEmailJS();

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      <ToastContainer />;
    </PersistGate>
  </Provider>
);
