"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useState } from "react";

export default function ChessBoardComponent() {
  // Store current game state
  const [game, setGame] = useState(() => new Chess());

  // Store whether computer is thinking
  const [isThinking, setIsThinking] = useState(false);

  // Random computer move
  function makeComputerMove(gameCopy: Chess) {
    // Find all legal moves
    const possibleMoves = gameCopy.moves();

    if (possibleMoves.length === 0) return;

    // Pick a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const randomMove = possibleMoves[randomIndex];

    // Make selected move
    gameCopy.move(randomMove);
  }

  // Check game status
  function getGameStatus() {
    if (isThinking) {
      return "Computer thinking...";
    }

    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Checkmate! Black wins."
        : "Checkmate! White wins.";
    }

    if (game.isStalemate()) {
      return "Stalemate! The game is a draw.";
    }

    if (game.isDraw()) {
      return "Draw!";
    }

    if (game.isCheck()) {
      return game.turn() === "w" ? "White is in check." : "Black is in check.";
    }

    return game.turn() === "w" ? "White to move." : "Black to move.";
  }

  // When a piece is dropped, verifies move is legal
  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) {
    // Prevent player from moving while computer is thinking
    if (isThinking) {
      return false;
    }

    // Copy of current game
    const gameCopy = new Chess();

    // Load the full PGN so move history is preserved
    gameCopy.loadPgn(game.pgn());

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

    // Save player move first so the board updates before computer responds
    setGame(gameCopy);

    // Computer response move
    if (!gameCopy.isGameOver()) {
      setIsThinking(true);

      setTimeout(() => {
        makeComputerMove(gameCopy);

        // Save updated game state and re-render the board
        const updatedGame = new Chess();
        updatedGame.loadPgn(gameCopy.pgn());
        setGame(updatedGame);

        setIsThinking(false);
      }, 500);
    }

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

    // Pass move state/verification
    onPieceDrop,
  };

  // Move history array
  const moves = game.history();

  // Group moves into White/Black pairs
  const movePairs = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || "",
    });
  }

  return (
    <div>
      <h2>{getGameStatus()}</h2>

      <Chessboard options={chessboardOptions} />

      <h3>Move History</h3>

      <table>
        <tbody>
          {movePairs.map((turn) => (
            <tr key={turn.moveNumber}>
              <td>{turn.moveNumber}.</td>
              <td>{turn.white}</td>
              <td>{turn.black}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
