import { useEffect, useState } from "react";
import useSocket from "../hooks/SocketHook";
import { Chess } from "chess.js";
import GameBoard from "../components/GameBoard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BackgroundBeams } from '../components/ui/background-beams';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_ENDED = "game_ended";


export default function Game() {
    //@ts-ignore
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());
    const [isStarted, setStarted] = useState<boolean>(false);
    const [myColor, setColor] = useState<"black" | "white" | null>(null);
    const [winner, setWinner] = useState(null);
    const [finding, setFinding] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [name, setName] = useState("");
    const [opponentName, setOpponentName] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();



    const [moveCount, setMoveCount] = useState<number>(0);
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            if (winner) return;
            switch (message.type) {
                case INIT_GAME:
                    setFinding(false);
                    setColor(message.payload.color);
                    setStarted(true);
                    setGameId(message.payload.id);
                    setOpponentName(message.payload.opponentName);
                    break;
                case MOVE:
                    game.move(message.move);
                    setBoard(game.board());
                    setMoveCount(moveCount + 1);
                    break;
                case GAME_OVER:
                    try {
                        if (message.payload.winner !== myColor) {
                            game.move(message.payload.move);
                            setBoard(game.board());
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    setWinner(message.payload.winner);
                    break;
                case GAME_ENDED:
                    alert(message.reason);
                    setTimeout(() => navigate("/"), 2000);
                    break;
            }
        };
    }, [socket]);

    if (!socket) {
        return <div>
            <div className="flex z-20 p-6 sm:p-20 md:p-40 relative justify-center items-center text-lg sm:text-xl font-bold text-white min-h-screen">Connecting...</div>
            <BackgroundBeams className='bg-neutral-950' />
        </div>
    }

    return (
        <div>
            <div className={`${width < 1100 ? 'flex mt-20 flex-col' : 'grid grid-cols-2'} min-h-screen bg-neutral-950 relative`}>

                <div className="flex justify-center items-center p-10 z-20">
                    {!isStarted && <img src="/image.png" alt="" className="max-w-full h-auto" />}
                    {isStarted && !finding && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <GameBoard gameId={gameId} game={game} board={board} setBoard={setBoard} socket={socket} myColor={myColor} moveCount={moveCount} setMoveCount={setMoveCount} />
                    </motion.div>}
                </div>

                <div className="flex flex-col justify-center items-center p-6 md:p-10 space-y-6 relative z-20">
                    {winner ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white libre-franklin-900">
                                {winner === myColor ? "🎉 You Won!" : "😞 You Lost"}
                                {winner === myColor && <Confetti width={width} height={height} />}
                            </h2>
                            <button
                                className="bg-amber-500 hover:bg-amber-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xl sm:text-2xl font-bold mt-5 text-white libre-franklin-900"
                            >
                                Find Next Match
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {!isStarted && !finding ? (
                                <motion.div className="flex flex-col w-full max-w-xs sm:max-w-sm" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border-2 w-full border-amber-500 bg-neutral-900 text-white p-3 rounded-lg cal-sans-regular placeholder:text-gray-400"
                                    />
                                    <button onClick={() => {
                                        if (!name.trim()) {
                                            alert("Please enter a name");
                                            return;
                                        }
                                        socket.send(JSON.stringify({ type: INIT_GAME, name }));
                                        setFinding(true);
                                    }} className="px-4 mt-3 py-2 rounded-md border border-amber-500 bg-amber-500 text-white text-sm hover:bg-amber-600 transition duration-200 libre-franklin-900">
                                        Find opponent
                                    </button>
                                </motion.div>
                            ) : null}

                            {isStarted && (
                                <motion.div className="flex flex-col justify-between space-y-4 text-center md:text-left mt-4 md:mt-0" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                                    <div>
                                        {opponentName && (
                                            <h2 className="text-xl sm:text-2xl text-white libre-franklin-900">
                                                {opponentName}
                                            </h2>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl text-white libre-franklin-900">You are playing as {myColor}</h2>
                                        <p className="mt-2 text-base sm:text-lg text-amber-500 cal-sans-regular">Game ID: {gameId}</p>
                                    </div>
                                    <div>
                                        {name && (
                                            <p className="text-base sm:text-lg text-white cal-sans-regular"> {name}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {finding && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg sm:text-xl font-bold text-white libre-franklin-900 text-center">Finding an opponent...</span>
                                        <motion.div className="mt-4 w-8 h-8 border-4 border-t-transparent border-amber-500 rounded-full animate-spin"></motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <BackgroundBeams className='bg-neutral-950' />
        </div>
    );
}