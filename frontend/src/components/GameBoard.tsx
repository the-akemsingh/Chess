import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/game";
import moveSound from '/capture.mp3';
import { useWindowSize } from 'react-use';

export default function ChessBoard({
  game,
  board,
  setBoard,
  socket,
  myColor,
  moveCount,
  setMoveCount
}: {
  game: Chess | null;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: ((value: React.SetStateAction<({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][]>) => void) | null;
  socket: WebSocket;
  myColor: "black" | "white" | "spectator" | null;
  moveCount?: number;
  setMoveCount?: (x: any) => void;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const { width } = useWindowSize();

  // Calculate responsive sizes
  const getBoardSize = () => {
    if (width < 400) return { boardWidth: 280, squareSize: 35, pieceSize: 25 };
    if (width < 600) return { boardWidth: 320, squareSize: 40, pieceSize: 30 };
    if (width < 768) return { boardWidth: 400, squareSize: 50, pieceSize: 35 };
    if (width < 1024) return { boardWidth: 480, squareSize: 60, pieceSize: 40 };
    return { boardWidth: 520, squareSize: 65, pieceSize: 40 };
  };

  const { boardWidth, squareSize, pieceSize } = getBoardSize();

  function playSound() {
    new Audio(moveSound).play();
  }

  useEffect(() => {
    if (moveCount !== 0) {
      playSound();
    }
  }, [moveCount]);

  const isFlipped = myColor === "black";

  return (
    <div className="flex flex-col justify-center items-center">
      <div 
        className="grid grid-cols-8 gap-0 border-2 border-gray-500 mx-auto" 
        style={{ width: boardWidth }}
      >
        {(isFlipped ? [...board].reverse() : board).map((row, i) =>
          (isFlipped ? [...row].reverse() : row).map((box, j) => {
            const col = isFlipped ? 7 - j : j;
            const rowIdx = isFlipped ? i + 1 : 8 - i;
            const squareRepresentation = (String.fromCharCode(97 + col) + rowIdx) as Square;
            const isSelected = from === squareRepresentation;

            return (
              <div
                onClick={() => {
                  if (myColor === "spectator") return;

                  if (from === squareRepresentation) {
                    setFrom(null);
                    return;
                  }

                  if (from && squareRepresentation != from) {
                    setFrom(squareRepresentation);
                  }

                  if (!from) {
                    if ((box?.color === "b" && myColor === "white") || (box?.color === "w" && myColor === "black")) {
                      alert("Invalid move");
                      return;
                    }
                    setFrom(squareRepresentation);
                  } else {
                    socket.send(
                      JSON.stringify({
                        type: MOVE,
                        move: {
                          from,
                          to: squareRepresentation,
                        },
                      })
                    );

                    game!.move({ from, to: squareRepresentation });
                    setBoard!(game!.board());
                    setMoveCount!(moveCount! + 1);
                    setFrom(null);
                  }
                }}
                key={j}
                style={{
                  height: squareSize,
                  width: squareSize,
                  backgroundColor: (i + j) % 2 === 0 ? `#779756` : '#b3bbc7',
                }}
                className={`flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:scale-105 transition-transform ${isSelected ? "border-2 border-neutral-800 scale-105" : ""}`}
              >
                {box && (
                  <img
                    style={{ height: pieceSize, width: 'auto' }}
                    src={box.color === "b" ? `/${box.type.toLowerCase()}.png` : `/${box?.type.toUpperCase()} copy.png`}
                    alt=""
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-2 text-sm md:text-base lg:text-lg text-white text-center">
        {(myColor === 'white' && game?.turn() === 'w') && <p>Your turn</p>}
        {(myColor === 'black' && game?.turn() === 'b') && <p>Your turn</p>}
      </div>
    </div>
  );
}