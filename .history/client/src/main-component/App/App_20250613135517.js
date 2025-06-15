import React, { useContext, useState } from "react";
import AllRoute from "../router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert, Snackbar } from "@mui/material";
import { MyContext, useMyContext } from "../../context/MyConext";
// import CustomCursor from '../../components/CustomCursor/CustomCursor';

const App = () => {
  const { alterBox, handleClose } = useContext(MyContext);
  return (
    <div className="App" id="scrool">
      <Snackbar
        open={alterBox.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alterBox.error === false ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alterBox.message}
        </Alert>
      </Snackbar>

      <AllRoute />
      {/* <CustomCursor/> */}
      <ToastContainer />
    </div>
  );
};

export default App;
