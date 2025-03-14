import React, { useState, MouseEvent } from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { fullScreen, exitFullScreen } from "../../utils/helper";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";
import screenIcon from "../../../public/icons/screen.svg";

// Styled components
const ScreenButton = styled(Button)(({ theme }) => ({
  padding: "6px 10px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  minWidth: "auto",
  "&.active": {
    background: "rgba(56,132,255,.1)",
  },
}));

interface ScreenProps {
  resume?: any; // Type this properly based on your actual store structure
}

const Screen: React.FC<ScreenProps> = observer(({ resume }) => {
  const [isScreenActive, setIsScreenActive] = useState(false);

  const toggleScreen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsScreenActive(!isScreenActive);
  };

  // Effect for fullscreen toggle
  React.useEffect(() => {
    if (isScreenActive) {
      fullScreen();
    } else {
      exitFullScreen();
    }
  }, [isScreenActive]);

  return (
    <Tooltip
      title="全屏"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <ScreenButton
        className={clsx({ active: isScreenActive })}
        onClick={toggleScreen}
      >
        <Image src={screenIcon} alt="fullscreen" width={24} height={24} />
      </ScreenButton>
    </Tooltip>
  );
});

export default Screen;
