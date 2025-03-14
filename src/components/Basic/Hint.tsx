import React from "react";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { blue, amber } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import SnackbarContent from "@mui/material/SnackbarContent";
import type { SnackbarContentProps } from "@mui/material/SnackbarContent";
import WarningIcon from "@mui/icons-material/Warning";

// Map variant to icon
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

// Types for the component
type VariantType = keyof typeof variantIcon;

interface HintProps extends Omit<SnackbarContentProps, "variant"> {
  className?: string;
  message: React.ReactNode;
  onClose?: () => void;
  variant: VariantType;
}

// Styled wrapper for the SnackbarContent
// We use the variant only in the styling function, not as a DOM attribute
const StyledSnackbarContent = styled(SnackbarContent)(({ theme, variant }) => {
  const variantType = variant as VariantType | undefined;
  return {
    backgroundColor:
      variantType === "success"
        ? blue[500]
        : variantType === "error"
          ? theme.palette.error.dark
          : variantType === "info"
            ? theme.palette.primary.dark
            : amber[700],
  };
});

const MessageWrapper = styled("span")({
  display: "flex",
  alignItems: "center",
});

const StyledIcon = styled("span")(({ theme }) => ({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme.spacing(1),
  display: "flex",
}));

/**
 * Hint component - displays a styled message with an icon based on the variant
 */
const Hint = React.forwardRef<HTMLDivElement, HintProps>(
  ({ className, message, onClose, variant, ...other }, ref) => {
    const IconComponent = variantIcon[variant];

    return (
      <StyledSnackbarContent
        ref={ref}
        className={className}
        variant={variant as any} // Pass variant as a prop to the styled component's styling function
        aria-describedby="client-snackbar"
        message={
          <MessageWrapper id="client-snackbar">
            <StyledIcon>
              <IconComponent fontSize="small" />
            </StyledIcon>
            {message}
          </MessageWrapper>
        }
        action={
          onClose
            ? [
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={onClose}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>,
              ]
            : undefined
        }
        {...other}
      />
    );
  },
);

Hint.displayName = "Hint";

export default Hint;
