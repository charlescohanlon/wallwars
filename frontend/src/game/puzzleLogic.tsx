import { Pos, Move, BoardSettings, posEq } from "../shared/gameLogicUtils";
import { turnCount, GameState } from "./gameState";
import { classicToInternalBoardDims } from "../shared/gameLogicUtils";

export type BoardSettingsStandardNotation = {
  dims: [number, number];
  startPos: [string, string];
  goalPos: [string, string];
};

export type Puzzle = {
  id: string;
  author: string;
  difficulty: number;
  boardSettings: BoardSettingsStandardNotation;
  creatorStarts: boolean;
  playAsCreator: boolean;
  moves: string;
  startIndex: number;
};

// Each entry is a list of alternative moves at each position.
// All the alternative moves are valid at each position.
export type PuzzleMoveList = Move[][];

export function lastPuzzleMoveIsCorrect(
  state: GameState,
  puzzle: Puzzle
): boolean {
  const tc = turnCount(state);
  if (tc === 0) return true; // No moves played yet.
  const moves = parsePuzzleMoveList(puzzle.moves);
  if (tc < puzzle.startIndex) return true;
  for (let i = 0; i < moves[tc - 1].length; i++) {
    if (isSameMove(moves[tc - 1][i], state.moveHistory[tc].actions))
      return true;
  }
  return false;
}

export function parsePuzzleMoveList(move_list_str: string): PuzzleMoveList {
  // A list where each entry is a string representing a list of alternative moves.
  const move_str_list = move_list_str.split(";");

  // A list where each entry is a list of strings representing the alternative moves.
  const alternative_move_str_list_list = move_str_list.map((move_str) =>
    move_str.split(",")
  );

  let res: PuzzleMoveList = [];
  alternative_move_str_list_list.forEach((alternative_move_str_list) => {
    let alternative_moves: Move[] = [];
    alternative_move_str_list.forEach((move_str) => {
      alternative_moves.push(parseMoveString(move_str));
    });
    res.push(alternative_moves);
  });
  return res;
}

export function puzzleBoardSettingsToInternalBoardSettings(
  puzzleBoardSettings: BoardSettingsStandardNotation
): BoardSettings {
  return {
    dims: classicToInternalBoardDims(puzzleBoardSettings.dims),
    startPos: [
      actionStrToCoordinates(puzzleBoardSettings.startPos[0]),
      actionStrToCoordinates(puzzleBoardSettings.startPos[1]),
    ],
    goalPos: [
      actionStrToCoordinates(puzzleBoardSettings.goalPos[0]),
      actionStrToCoordinates(puzzleBoardSettings.goalPos[1]),
    ],
  };
}

// =========================
// Internal functions.
// =========================

function isSameMove(actions1: Pos[], actions2: Pos[]): boolean {
  if (actions1.length !== actions2.length) return false;
  if (actions1.length === 1) return posEq(actions1[0], actions2[0]);
  return (
    (posEq(actions1[0], actions2[0]) && posEq(actions1[1], actions2[1])) ||
    (posEq(actions1[0], actions2[1]) && posEq(actions1[1], actions2[0]))
  );
}

function actionStrToCoordinates(action_str: string): Pos {
  const col_letter = action_str[0].toLowerCase();
  const row_num = action_str[1];
  let internal_row_idx =
    ((row_num === "x" || row_num === "X" ? 10 : +row_num) - 1) * 2;
  let internal_col_idx = (col_letter.charCodeAt(0) - 97) * 2;
  if (action_str.length === 3) {
    if (action_str[2] === "v" || action_str[2] === "V") {
      internal_row_idx++;
    } else if (action_str[2] === ">") {
      internal_col_idx++;
    } else {
      console.error("actionStrToCoordinates error: ", action_str);
    }
  }
  return [internal_row_idx, internal_col_idx];
}

function parseMoveString(move_str: string): Move {
  const action_strs = move_str.trim().split(" ");
  let res: Move = [];
  action_strs.forEach((action_str) => {
    res.push(actionStrToCoordinates(action_str));
  });
  return res;
}
