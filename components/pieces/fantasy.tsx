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

export const fantasyPieces = {
  wP: () => <Piece src="/pieces/fantasy/wP.svg" alt="White Pawn" />,
  wN: () => <Piece src="/pieces/fantasy/wN.svg" alt="White Knight" />,
  wB: () => <Piece src="/pieces/fantasy/wB.svg" alt="White Bishop" />,
  wR: () => <Piece src="/pieces/fantasy/wR.svg" alt="White Rook" />,
  wQ: () => <Piece src="/pieces/fantasy/wQ.svg" alt="White Queen" />,
  wK: () => <Piece src="/pieces/fantasy/wK.svg" alt="White King" />,
  bP: () => <Piece src="/pieces/fantasy/bP.svg" alt="Black Pawn" />,
  bN: () => <Piece src="/pieces/fantasy/bN.svg" alt="Black Knight" />,
  bB: () => <Piece src="/pieces/fantasy/bB.svg" alt="Black Bishop" />,
  bR: () => <Piece src="/pieces/fantasy/bR.svg" alt="Black Rook" />,
  bQ: () => <Piece src="/pieces/fantasy/bQ.svg" alt="Black Queen" />,
  bK: () => <Piece src="/pieces/fantasy/bK.svg" alt="Black King" />,
};