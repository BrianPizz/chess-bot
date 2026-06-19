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

export const frescaPieces = {
  wP: () => <Piece src="/pieces/fresca/wP.svg" alt="White Pawn" />,
  wN: () => <Piece src="/pieces/fresca/wN.svg" alt="White Knight" />,
  wB: () => <Piece src="/pieces/fresca/wB.svg" alt="White Bishop" />,
  wR: () => <Piece src="/pieces/fresca/wR.svg" alt="White Rook" />,
  wQ: () => <Piece src="/pieces/fresca/wQ.svg" alt="White Queen" />,
  wK: () => <Piece src="/pieces/fresca/wK.svg" alt="White King" />,

  bP: () => <Piece src="/pieces/fresca/bP.svg" alt="Black Pawn" />,
  bN: () => <Piece src="/pieces/fresca/bN.svg" alt="Black Knight" />,
  bB: () => <Piece src="/pieces/fresca/bB.svg" alt="Black Bishop" />,
  bR: () => <Piece src="/pieces/fresca/bR.svg" alt="Black Rook" />,
  bQ: () => <Piece src="/pieces/fresca/bQ.svg" alt="Black Queen" />,
  bK: () => <Piece src="/pieces/fresca/bK.svg" alt="Black King" />,
};