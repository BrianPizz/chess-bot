"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useState } from "react";
import { pieceThemes, PieceThemeName } from "./pieces";

export default function ChessBoardComponent() {
  // Store current game state
  const [game, setGame] = useState(() => new Chess());

  // Store whether computer is thinking
  const [isThinking, setIsThinking] = useState(false);

  const [viewedMoveIndex, setViewedMoveIndex] = useState<number | null>(null);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const [pieceTheme, setPieceTheme] = useState<PieceThemeName>("cburnett");

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

    setViewedMoveIndex(null);

    setSelectedSquare(null);
    // Return legal move
    return true;
  }
  // Get detailed move history so we can detect captures
  const detailedMoves = game.history({ verbose: true });

  // Track captured pieces
  const whiteCaptured: string[] = [];
  const blackCaptured: string[] = [];

  // Convert chess.js piece letters into chess symbols
  const pieceSymbols: Record<string, string> = {
    p: "♟",
    n: "♞",
    b: "♝",
    r: "♜",
    q: "♛",
    k: "♚",
  };

  // Add pieces to captured lists
  detailedMoves.forEach((move) => {
    if (move.captured) {
      if (move.color === "w") {
        whiteCaptured.push(pieceSymbols[move.captured]);
      } else {
        blackCaptured.push(pieceSymbols[move.captured]);
      }
    }
  });

  // Full move history
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

  // Decide which board position to show
  function getDisplayedPosition() {
    if (viewedMoveIndex === null) {
      return game.fen();
    }

    const previewGame = new Chess();

    for (let i = 0; i < viewedMoveIndex; i++) {
      previewGame.move(moves[i]);
    }

    return previewGame.fen();
  }

  // Highlight legal move options for the selected piece
  const squareStyles: Record<string, React.CSSProperties> = {};

  if (selectedSquare && viewedMoveIndex === null) {
    squareStyles[selectedSquare] = {
      backgroundColor: "rgba(255, 255, 0, 0.7)",
    };

    const legalMoves = game.moves({
      square: selectedSquare as any,
      verbose: true,
    });

    legalMoves.forEach((move) => {
      squareStyles[move.to] = {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      };
    });
  }

  // When a square is clicked, either select a piece or move the selected piece
  function onSquareClick({ square }: { square: string }) {
    if (viewedMoveIndex !== null || isThinking || game.isGameOver()) {
      return;
    }

    const clickedPiece = game.get(square as any);

    // If no piece is currently selected, select a white piece
    if (selectedSquare === null) {
      if (clickedPiece && clickedPiece.color === "w") {
        setSelectedSquare(square);
      }

      return;
    }

    // If clicking another white piece, switch selection
    if (clickedPiece && clickedPiece.color === "w") {
      setSelectedSquare(square);
      return;
    }

    // Try to move selected piece to clicked square
    onPieceDrop({
      sourceSquare: selectedSquare,
      targetSquare: square,
    });

    // Clear selection after attempting move
    setSelectedSquare(null);
  }

  // Chessboard configurations
  const chessboardOptions = {
    // Current board position as FEN string
    position: getDisplayedPosition(),

    // Light square color
    lightSquareStyle: {
      backgroundColor: "#eeeed2",
    },

    // Dark square color
    darkSquareStyle: {
      backgroundColor: "#769656",
    },

    squareStyles,

    onSquareClick,

    // Pass move state/verification
    onPieceDrop,

    pieces: pieceThemes[pieceTheme],

    // Only allow dragging when viewing the current position
    allowDragging:
      viewedMoveIndex === null && !isThinking && !game.isGameOver(),
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 items-start">
        {/* Board column */}
        <div className="w-full max-w-[calc(100vw-32px)] md:max-w-[650px] lg:max-w-[800px] xl:max-w-[900px]">
          <h2 className="mb-3 text-xl font-semibold">{getGameStatus()}</h2>

          {/* Board square wrapper */}
          <div className="aspect-square overflow-hidden">
            <Chessboard options={chessboardOptions} />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setViewedMoveIndex(0)}
              className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-1 cursor-pointer"
            >
              Start
            </button>

            <button
              onClick={() =>
                setViewedMoveIndex((current) => {
                  const index = current === null ? moves.length : current;
                  return Math.max(0, index - 1);
                })
              }
              className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-1 cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setViewedMoveIndex((current) => {
                  if (current === null) return null;

                  const nextIndex = current + 1;

                  return nextIndex >= moves.length ? null : nextIndex;
                })
              }
              className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-1 cursor-pointer"
            >
              Next
            </button>

            <button
              onClick={() => setViewedMoveIndex(null)}
              className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-1 cursor-pointer"
            >
              Current
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-[300px] max-h-[70vh] overflow-y-auto rounded-lg bg-gray-100 p-4">
          <h3 className="mb-2 text-lg font-bold">Move History</h3>

          <table className="w-full">
            <tbody>
              {movePairs.map((turn) => (
                <tr key={turn.moveNumber}>
                  <td className="pr-3 text-gray-500">{turn.moveNumber}.</td>
                  <td className="w-14">{turn.white}</td>
                  <td className="w-14">{turn.black}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-6 mb-2 text-lg font-bold">Captured Pieces</h3>

          <p>
            White captured:{" "}
            {whiteCaptured.length > 0 ? whiteCaptured.join(" ") : "None"}
          </p>

          <p>
            Black captured:{" "}
            {blackCaptured.length > 0 ? blackCaptured.join(" ") : "None"}
          </p>
          <div className="mt-6">
            <label className="mb-2 block text-md font-semibold text-gray-700">
              Piece Theme
            </label>

            <select
              value={pieceTheme}
              onChange={(e) => setPieceTheme(e.target.value as PieceThemeName)}
              className="rounded border bg-white px-2 py-1"
            >
              <option value="cburnett">CBurnett</option>
              <option value="fresca">Fresca</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
