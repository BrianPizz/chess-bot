import { cburnettPieces } from "./cburnett";
import { frescaPieces } from "./fresca";
import { fantasyPieces } from "./fantasy";

export const pieceThemes = {
  cburnett: cburnettPieces,
  fresca: frescaPieces,
  fantasy: fantasyPieces,
};

export type PieceThemeName = keyof typeof pieceThemes;