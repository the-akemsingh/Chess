import { useEffect, useState } from "react"
import axios from 'axios'
import useSocket from "../hooks/SocketHook";
import GameBoard from "../components/GameBoard";
import {  Color, PieceSymbol, Square } from "chess.js";

//{"games":["0.646021158915842"]}
export const SPECTATE = "spectate";
export const SPECTATE_UPDATE = "spectate_update";


export default function Spectate() {
    const socket = useSocket()
    const [games, setGames] = useState<string[] | null>();
    const [isStarted, setStarted] = useState<boolean>(false);
    const [player1,setPlayer1]=useState<string|null>(null)
    const [player2,setPlayer2]=useState<string|null>(null)
    const [winner,setWinnner]=useState<string|null>(null);
    const [board, setBoard] = useState<(({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][] | null)>(null)


    useEffect(() => {
        if (!socket) {
            return
        }
        socket.onmessage = (event: any) => {
            const message = JSON.parse(event.data);
            if (message.type === SPECTATE) {
                setBoard(message.game)
                setPlayer1(message.player1)
                setPlayer2(message.player2)
                setStarted(true)
            }
            if (message.type === SPECTATE_UPDATE) {
                try {
                    
                    setBoard(message.payload);
                }
                catch (e) {
                    console.log(e);
                }
            }
            
        }
    }, [socket])


    useEffect(() => {
        async function getGames() {
            const res = await axios.get("http://localhost:3000/all-games");
            //@ts-ignore
            setGames(res.data.games);
        }
        getGames();
    }, [])

    async function spectateMatch(gameId: string) {
        socket?.send(JSON.stringify({
            type: SPECTATE,
            gameId
        }))
    }

    return <div>
        {!isStarted ? <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Available Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games?.map((game) => (
                    <div key={game} className="bg-gray-200 p-4 rounded-lg shadow-md">
                        <p className="text-lg font-semibold">Game ID: {game}</p>
                        <button onClick={() => spectateMatch(game)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Spectate
                        </button>
                    </div>
                ))}
            </div>
        </div> : <div className=" pt-24 grid grid-cols-2">
            <GameBoard board={board!} game={null} myColor={"spectator"} setBoard={null} socket={socket!} ></GameBoard>
            {!winner ?<div className=" font-black text-2xl flex flex-col justify-between">
                <div>{player2}</div>
                <div>{player1}</div>
            </div> : <div>
                {`${winner} wins the match`}
            </div> }
        </div>}
    </div>
}