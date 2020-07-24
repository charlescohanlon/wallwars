import React from "react";
import { Row, Col } from "react-materialize";

const TimerHeader = ({
  lifeCycleStage,
  playerNames,
  playerColors,
  timeLeft1,
  timeLeft2,
  p1ToMove,
}) => {
  const actor = p1ToMove ? 1 : 2;
  const name1 = playerNames[0];
  const name2 = playerNames[1] === null ? "......" : playerNames[1];
  const [color1, color2] = playerColors;
  const turnHighlight = "lighten-1 z-depth-2";
  const lowTimeColor = "orange lighten-2 z-depth-3";
  const lowTime = 15;

  const [min1, min2] = [Math.floor(timeLeft1 / 60), Math.floor(timeLeft2 / 60)];
  const [sec1, sec2] = [timeLeft1 % 60, timeLeft2 % 60];

  const highlightName1 =
    lifeCycleStage < 4 && actor === 1 ? ` ${color1} ${turnHighlight}` : "";
  const highlightName2 =
    lifeCycleStage < 4 && actor === 2 ? ` ${color2} ${turnHighlight}` : "";
  return (
    <Row className="valign-wrapper container">
      <Col className={"center" + highlightName1} s={2}>
        <h5>{name1}</h5>
      </Col>
      <Col
        className={
          "center" +
          (actor === 1 && timeLeft1 < lowTime ? ` ${lowTimeColor}` : "")
        }
        s={2}
        style={{ margin: "0rem 1rem" }}
      >
        <h5>
          {min1}:{sec1 < 10 && "0"}
          {sec1}
        </h5>
      </Col>
      <Col s={4}></Col>
      <Col
        className={
          "center" +
          (actor === 2 && timeLeft2 < lowTime ? ` ${lowTimeColor}` : "")
        }
        s={2}
        style={{ margin: "0rem 1rem" }}
      >
        <h5>
          {min2}:{sec2 < 10 && "0"}
          {sec2}
        </h5>
      </Col>
      <Col className={"center" + highlightName2} s={2}>
        <h5>{name2}</h5>
      </Col>
    </Row>
  );
};

export default TimerHeader;