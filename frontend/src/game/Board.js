import React, { useState } from "react";

import { cellTypeByPos, posEq } from "../gameLogic/mainLogic";

//cosmetic parameters of the board
const displayParams = {
  groundColor: "#ffffff",
  groundHoverColor: "#fbe4D6",
  emptyWallColor: "#eaeaea",
  emptyWallHoverColor: "#f1bfa0",
  pillarColor: "#cccccc",
  playerIcons: ["face", "outlet"],
  borderStyle: "1px solid black",
};

//stateless component to display the board. all the state is at GamePage
const Board = ({
  grid,
  ghostAction,
  playerColors: [color1, color2],
  playerPos: [p1, p2],
  goals: [g1, g2],
  handleClick,
  creatorToMove,
  groundSize,
  wallWidth,
}) => {
  const dims = { h: grid.length, w: grid[0].length };
  const allPos = [];
  for (let r = 0; r < dims.h; r++)
    for (let c = 0; c < dims.w; c++) allPos[r * dims.w + c] = { r: r, c: c };

  const [icon1, icon2] = displayParams.playerIcons;
  const [repRows, repCols] = [(dims.h - 1) / 2, (dims.w - 1) / 2];

  const [hoveredCell, setHoveredCell] = useState(null);

  const handleMouseEnter = (pos) => {
    setHoveredCell(pos);
  };
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const iconSize = 0.8 * groundSize;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${repCols}, ${groundSize}px ${wallWidth}px) ${groundSize}px`,
        gridTemplateRows: `repeat(${repRows}, ${groundSize}px ${wallWidth}px) ${groundSize}px`,
        justifyContent: "center",
        gridArea: "board",
      }}
    >
      {allPos.map((pos) => {
        const [p1Here, p2Here] = [posEq(pos, p1), posEq(pos, p2)];
        const [goal1Here, goal2Here] = [posEq(pos, g1), posEq(pos, g2)];
        //ghosts are the partial moves that are only displayed locally
        const ghostHere = ghostAction !== null && posEq(ghostAction, pos);
        const [p1GhostHere, p2GhostHere] = [
          ghostHere && creatorToMove,
          ghostHere && !creatorToMove,
        ];
        const cellType = cellTypeByPos(pos);

        let color;
        if (cellType === "Ground") {
          if (hoveredCell && posEq(pos, hoveredCell))
            color = displayParams.groundHoverColor;
          else color = displayParams.groundColor;
        } else if (cellType === "Wall") {
          if (hoveredCell && posEq(pos, hoveredCell))
            color = displayParams.emptyWallHoverColor;
          else color = displayParams.emptyWallColor;
        } else color = displayParams.pillarColor;

        let className = "";
        //add waves cosmetic effect when clicking a cell
        if (cellType === "Ground") className += " waves-effect waves-light";
        if (cellType === "Wall") className += " waves-effect waves-dark";

        const anyIconHere = p1Here || p2Here || p1GhostHere || p2GhostHere;

        //special coloring for Ground cells containing the goals goals
        if (goal1Here) className = color1 + " lighten-4";
        if (goal2Here) className = color2 + " lighten-4";
        //wall coloring for built walls (depending on builder)
        if (cellType === "Wall") {
          const solidWallHere = grid[pos.r][pos.c] !== 0;
          if (solidWallHere || ghostHere) {
            if (solidWallHere) {
              className = grid[pos.r][pos.c] === 1 ? color1 : color2;
              className += " darken-3";
            } else {
              className = creatorToMove ? color1 : color2;
              className += " lighten-3";
            }
          }
        }

        return (
          <div
            className={className}
            key={`cell_${pos.r}_${pos.c}`}
            onClick={() => {
              if (cellType !== "Pillar") handleClick(pos);
            }}
            onMouseEnter={() => handleMouseEnter(pos)}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor: color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderTop: pos.r === 0 ? displayParams.borderStyle : "",
              borderBottom:
                pos.r === dims.h - 1 ? displayParams.borderStyle : "",
              borderLeft: pos.c === 0 ? displayParams.borderStyle : "",
              borderRight:
                pos.c === dims.w - 1 ? displayParams.borderStyle : "",
            }}
          >
            {p1Here && (
              <i
                className={`material-icons ${color1}-text`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon1}
              </i>
            )}
            {p2Here && (
              <i
                className={`material-icons ${color2}-text`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon2}
              </i>
            )}
            {goal1Here && !anyIconHere && (
              <i
                className={`material-icons white-text`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon1}
              </i>
            )}
            {goal2Here && !anyIconHere && (
              <i
                className={`material-icons white-text`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon2}
              </i>
            )}
            {p1GhostHere && cellType === "Ground" && (
              <i
                className={`material-icons ${color1}-text text-lighten-4`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon1}
              </i>
            )}
            {p2GhostHere && cellType === "Ground" && (
              <i
                className={`material-icons ${color2}-text text-lighten-4`}
                style={{ fontSize: `${iconSize}px` }}
              >
                {icon2}
              </i>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
