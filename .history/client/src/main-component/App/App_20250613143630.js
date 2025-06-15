import React from "react";
import AllRoute from "../router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../../messages/message";

// import CustomCursor from '../../components/CustomCursor/CustomCursor';

const App = () => {
  return (
    <div className="App" id="scrool">
      <Message />
      <AllRoute />
      {/* <CustomCursor/> */}
      <ToastContainer />
    </div>
  );
};

export default App;
