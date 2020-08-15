import React from "react";
import "materialize-css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "react-toastify/dist/ReactToastify.css";

import IconButton from "./IconButton";
import showToastNotification from "./showToastNotification";

function Header({
  context, //Player, Spectator, or Lobby
  helpText,
  aboutText,
  joinCode,
  handleLeaveGame,
  isLargeScreen,
  isDarkModeOn,
  handleToggleDarkMode,
}) {
  let mainText;
  if (context === "Lobby") {
    mainText = <span>WallWars</span>;
  } else if (context === "Spectator") {
    mainText = (
      <span style={{ cursor: "pointer" }} onClick={handleLeaveGame}>
        WallWars
      </span>
    );
  } else {
    mainText = (
      <span>
        {isLargeScreen && (
          <span style={{ cursor: "pointer" }} onClick={handleLeaveGame}>
            WallWars
          </span>
        )}
        {isLargeScreen && <span>&nbsp;</span>}
        <CopyToClipboard
          style={{ cursor: "pointer" }}
          text={joinCode}
          onCopy={() => showToastNotification("Join code copied to clipboard!")}
        >
          <span>Code {joinCode}</span>
        </CopyToClipboard>
      </span>
    );
  }

  const color = isDarkModeOn ? "red darken-4" : "red lighten-1";
  const padding = isLargeScreen ? 20 : 11;

  return (
    <div>
      <div
        className={color}
        style={{
          height: "50px",
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "auto auto",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: isLargeScreen ? "30px" : "25px",
            marginLeft: isLargeScreen ? "15px" : "5px",
          }}
        >
          {mainText}
        </div>
        <div
          style={{
            height: "auto",
            display: "grid",
            padding: "5px",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: `auto`,
            columnGap: "5px",
            rowGap: "5px",
            marginRight: isLargeScreen ? "15px" : "5px",
          }}
        >
          <IconButton
            icon={isDarkModeOn ? "brightness_2" : "brightness_4"}
            tooltip={isDarkModeOn ? "Turn off dark mode" : "Turn on dark mode"}
            onClick={handleToggleDarkMode}
            bgColor="red darken-1"
            padding={padding}
          />
          <IconButton
            icon="help"
            tooltip="Help"
            modalTitle="Help"
            modalBody={helpText}
            bgColor="red darken-1"
            padding={padding}
          />
          {context === "Lobby" && (
            <IconButton
              icon="info"
              tooltip="About"
              modalTitle="About"
              modalBody={aboutText}
              bgColor="red darken-1"
              padding={padding}
            />
          )}
          {context !== "Lobby" && (
            <IconButton
              icon="home"
              tooltip="Leave game"
              onClick={handleLeaveGame}
              bgColor="red darken-1"
              padding={padding}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
