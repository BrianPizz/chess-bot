function Piece({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%" }}
      draggable={false}
    />
  );
}

export const cburnettPieces = {
  wP: () => <Piece src="/pieces/cburnett/wP.svg" alt="White Pawn" />,
  wN: () => <Piece src="/pieces/cburnett/wN.svg" alt="White Knight" />,
  wB: () => <Piece src="/pieces/cburnett/wB.svg" alt="White Bishop" />,
  wR: () => <Piece src="/pieces/cburnett/wR.svg" alt="White Rook" />,
  wQ: () => <Piece src="/pieces/cburnett/wQ.svg" alt="White Queen" />,
  wK: () => <Piece src="/pieces/cburnett/wK.svg" alt="White King" />,

  bP: () => <Piece src="/pieces/cburnett/bP.svg" alt="Black Pawn" />,
  bN: () => <Piece src="/pieces/cburnett/bN.svg" alt="Black Knight" />,
  bB: () => <Piece src="/pieces/cburnett/bB.svg" alt="Black Bishop" />,
  bR: () => <Piece src="/pieces/cburnett/bR.svg" alt="Black Rook" />,
  bQ: () => <Piece src="/pieces/cburnett/bQ.svg" alt="Black Queen" />,
  bK: () => <Piece src="/pieces/cburnett/bK.svg" alt="Black King" />,
};