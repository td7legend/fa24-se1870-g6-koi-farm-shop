import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.scss";
import reduxStore from "./redux.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { initEmailJS } from "./config/emailjsConfig.js";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.jsx";

const { store, persistor } = reduxStore();
const root = ReactDOM.createRoot(document.getElementById("root"));
initEmailJS();

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <I18nextProvider i18n={i18n}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </I18nextProvider>
    </PersistGate>
  </Provider>
);
