import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/main-component/App/App";
import reportWebVitals from "./reportWebVitals";
import { ParallaxProvider } from "react-scroll-parallax";
import "./css/all.min.css";
import "./css/animate.css";
import "./scss/main.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/index";
import { Provider } from "react-redux";
import { MyProvider } from "./context/MyConext";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId =
  "715777490374-ig5f3ufvqdhe4uml8pqmo15n9om6ioej.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ParallaxProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <MyProvider>
            <App />
          </MyProvider>
        </GoogleOAuthProvider>
      </ParallaxProvider>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
