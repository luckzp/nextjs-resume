import React from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { observer } from "mobx-react-lite";
import { ENTER_DELAY, LEAVE_DELAY, HELP_INFO } from "../../utils/constant";
import { useStore } from "../../stores";
import Image from "next/image";

// Define styles using MUI v6 styled API
const HelpButton = styled(Button)(({ theme }) => ({
  padding: "6px 8px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",
  height: "100%",
  minWidth: "auto",
}));

interface HelpProps {
  className?: string;
}

const Help: React.FC<HelpProps> = ({ className }) => {
  const { hint } = useStore();

  const showHelpInfo = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Show success notification with help info
    hint.setSuccess({
      isOpen: true,
      message: "帮助信息已显示",
    });

    // You might implement a custom dialog later for displaying HELP_INFO
    console.log("Help info:", HELP_INFO);
  };

  return (
    <Tooltip
      title="帮助"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <HelpButton className={className} onClick={showHelpInfo}>
        <Image src="/icons/help.svg" alt="help icon" width={24} height={24} />
      </HelpButton>
    </Tooltip>
  );
};

export default observer(Help);
