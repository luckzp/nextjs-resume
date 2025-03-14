"use client";

import React from "react";
import { Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import HintComponent from "./Basic/Hint";
import { useStore } from "../stores";

/**
 * HintDialog - A component that displays success and error notifications
 * using Snackbars with custom styled Hint components
 */
const HintDialog = observer(() => {
  const { hint } = useStore();

  const closeSuccessHint = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    hint.setSuccess({ isOpen: false });
  };

  const closeErrorHint = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    hint.setError({ isOpen: false });
  };

  const isSuccessOpen = hint.success.isOpen;
  const successMessage = hint.success.message;
  const isErrorOpen = hint.error.isOpen;
  const errorMessage = hint.error.message;

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={isSuccessOpen}
        autoHideDuration={5000}
        onClose={closeSuccessHint}
      >
        <HintComponent
          onClose={closeSuccessHint}
          variant="success"
          message={successMessage}
        />
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={isErrorOpen}
        autoHideDuration={5000}
        onClose={closeErrorHint}
      >
        <HintComponent
          onClose={closeErrorHint}
          variant="error"
          message={errorMessage}
        />
      </Snackbar>
    </>
  );
});

export default HintDialog;
