"use client";

import React, { useEffect } from "react";
import { toast, Toaster } from "sonner";
import useHintStore from "../stores/HintStore";

/**
 * HintDialog - A component that displays success and error notifications
 * using Sonner toast library
 */
const HintDialog = () => {
  const { error, success, setError, setSuccess } = useHintStore();

  useEffect(() => {
    if (success.isOpen) {
      toast.success(success.message, {
        onDismiss: () => setSuccess({ isOpen: false }),
        duration: 2000,
      });
    }
  }, [success.isOpen, success.message, setSuccess]);

  useEffect(() => {
    if (error.isOpen) {
      toast.error(error.message, {
        onDismiss: () => setError({ isOpen: false }),
        duration: 2000,
      });
    }
  }, [error.isOpen, error.message, setError]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          color: "black",
        },
      }}
    />
  );
};

export default HintDialog;
