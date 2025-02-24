import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/game";
import moveSound from '/capture.mp3';

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
  moveCount?:number;
  setMoveCount?:(x:any)=>void;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  // const [moveCount, setMoveCount] = useState<number>(0);

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
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-500" style={{ width: 520 }}>
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
                  height: 65,
                  backgroundColor: (i + j) % 2 === 0 ? `#779756` : '#b3bbc7',
                }}
                className={`flex items-center justify-center text-2xl font-bold hover:scale-105 transition-transform ${isSelected ? "border-2 border-neutral-800 scale-105" : ""
                  }`}
              >
                {box && (
                  <img
                    style={{ height: 40 }}
                    src={box.color === "b" ? `/${box.type.toLowerCase()}.png` : `/${box?.type.toUpperCase()} copy.png`}
                    alt=""
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      <div>
        {(myColor === 'white' && game?.turn() === 'w') && <p>Your turn</p>}
        {(myColor === 'black' && game?.turn() === 'b') && <p>Your turn</p>}
      </div>

    </div>
  );
}