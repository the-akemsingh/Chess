import { useEffect, useState } from "react";
import useSocket from "../hooks/SocketHook";
import { Chess } from "chess.js";
import GameBoard from "../components/GameBoard";
import { useNavigate } from "react-router-dom";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export default function Landing() {
    const [game, setGame] = useState(new Chess())
    const [board, setBoard] = useState(game.board())
    const [isStarted, setStarted] = useState<boolean>(false)
    const [myColor, setColor] = useState<"black" | "white" | null>(null);
    const [winner, setWinner] = useState<"black" | "white" | null>(null)
    const [finding, setFinding] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string | null>(null);
    const [name,setName]=useState<string | null>(null);


    const socket = useSocket();
    const navigate = useNavigate()

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event: any) => {
            const message = JSON.parse(event.data);
            // console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setFinding(false);
                    // console.log(message)
                    setColor(message.payload?.color)
                    setStarted(true)
                    setGameId(message.payload.id);
                    break;
                case MOVE:
                    const move = message.move
                    game.move(move);
                    setBoard(game.board());
                    break;
                case GAME_OVER:
                    if (winner != myColor) {
                        const wmove = message.payload.move
                        game.move(wmove);
                        setBoard(game.board());
                    }

                    setWinner(message.payload.winner);
                    break;
            }
        }

    }, [socket])

    if (socket == null) {
        return <div>
            connecting...
        </div>
    }


    return <div className="grid-cols-2 min-h-screen  min-w-full flex">
        <div className="col-span-1  pt-24  w-full">
            <GameBoard game={game} board={board} setBoard={setBoard} socket={socket} myColor={myColor}></GameBoard>
        </div>
        <div className=" w-full pt-24  col-span-1">
            {winner ? <div className="text-black text-3xl font-bold font-mono">
                {winner == myColor ? <div>You won the match</div> : <div>You lost</div>}
                <button onClick={() => {
                    navigate('/')
                }} className="bg-green-600 mt-5 p-3 max-w-52 hover:bg-green-900 text-white text-3xl font-bold  rounded-sm">Find next match</button>
            </div> : <>
                {(!isStarted && !finding) && <div className="flex flex-col">
                    <input onChange={(e)=>{
                        setName(e.target.value);
                    }} className="border border-black max-w-52" type="text" placeholder="name" />
                    <button onClick={() => {
                        socket.send(JSON.stringify({
                            type: INIT_GAME,
                            name
                        }))
                        setFinding(true);
                    }} className="bg-green-600 mt-5 p-3 max-w-52 hover:bg-green-900 text-white text-3xl font-bold  rounded-sm">Enter</button>
                </div>
                }
                {isStarted && !finding && <div className="text-black text-3xl font-bold font-mono ">
                    {`Yours is ${myColor}`} <br />
                    <div>
                        GameId:{`${gameId}`}
                    </div>
                </div>}
                {finding && <div>
                    Finding opponent
                </div>}
            </>}

        </div>
    </div>
}