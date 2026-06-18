"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useState } from "react";

export default function ChessBoardComponent() {
    // Store current game state
  const [game, setGame] = useState(() => new Chess());

  // when a piece is dropped, verifies move is legal
  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) {
    // Copy of current game
    const gameCopy = new Chess(game.fen());

    // Random computer move
    function makeComputerMove(gameCopy: Chess) {
    // find all legal moves
    const possibleMoves = gameCopy.moves();

    if (possibleMoves.length === 0) return;
    // Pick a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const randomMove = possibleMoves[randomIndex];
    // Make selected move
    gameCopy.move(randomMove);
  }

    // Attempts to make move
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      // Auto promote pawn to queen
      promotion: "q",
    });
    // Null move is illegal
    if (move === null) {
      return false;
    }

    // Computer response move
    makeComputerMove(gameCopy);

    // Save updated game state and re-render the board
    setGame(gameCopy);
    // Return legal move
    return true;
  }

  // Chessboard configurations 
  const chessboardOptions = {
    // Current board position as FEN string
    position: game.fen(),
    // Light square color
    lightSquareStyle: {
      backgroundColor: "#eeeed2",
    },
    // Dark square color
    darkSquareStyle: {
      backgroundColor: "#769656",
    },
    // pass move state/verification
    onPieceDrop,
  };

  return <Chessboard options={chessboardOptions} />;
}