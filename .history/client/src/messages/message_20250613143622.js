import { Alert, Snackbar } from "@mui/material";
import React, { useContext } from "react";
import { useMyContext } from "../context/MyConext";

const Message = () => {
  const { handleClose, alterBox } = useMyContext;
  return (
    <div>
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
    </div>
  );
};

export default Message;
