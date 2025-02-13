import { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../pages/game";

export default function GameBoard({ game, board, setBoard, socket, myColor }: {
    game: Chess | null,
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    setBoard: ((value: React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>) => void ) | null,
    socket: WebSocket,
    myColor: "black" | "white" | "spectator" | null
}) {

    const [from, setFrom] = useState<Square | null>(null);

    return <div>
        <div className="ml-32">
            <div className="grid grid-cols-8 gap-0" style={{ width: 520 }} >

                {board!.map((row, i) => row.map((box, j) => {
                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                    const isSelected = from === squareRepresentation;
                    return <div
                        onClick={() => {
                            if(myColor==="spectator"){
                                return;
                            }
                            if (!from) {
                                if ((box?.color === 'b' && myColor == "white") || (box?.color === 'w' && myColor == "black")) {
                                    alert("Invalid move");
                                    return
                                }
                                setFrom(squareRepresentation);
                            } else {
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    move: {
                                        from,
                                        to: squareRepresentation
                                    }
                                }))

                                setFrom(null)
                                game!.move({
                                    from,
                                    to: squareRepresentation
                                });
                                setBoard!(game!.board());
                            }
                        }}

                        key={j}
                        style={{ height: 65, backgroundColor: ` ${(i + j) % 2 === 0 ? `#779756` : '#b3bbc7'} ` }}
                        className={`flex  items-center justify-center text-2xl  font-bold hover:scale-x-105 ${isSelected ? ` border-b-neutral-80 border-2 scale-105 ease-in ` : ``}   `}
                    >
                        <img style={{ height: 30 }} src={box?.color === 'b' ? `/${box.type.toLowerCase()}.png` : `/${box?.type.toUpperCase()} copy.png`} alt="" />

                    </div>
                }
                ))}
            </div>
        </div>

    </div>
}