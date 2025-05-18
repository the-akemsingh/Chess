import { useEffect, useState } from "react";
import axios from "axios";
import useSocket from "../hooks/SocketHook";
import GameBoard from "../components/GameBoard";
import { Chess } from "chess.js";
import { motion } from "framer-motion";
import moveSound from '/capture.mp3';
import { Link } from "react-router-dom";
import { BackgroundBeams } from "../components/ui/background-beams";


export const SPECTATE = "spectate";
export const SPECTATE_UPDATE = "spectate_update";

export default function Spectate() {
  const socket = useSocket();
  const [games, setGames] = useState<string[]>([]);
  const [isStarted, setStarted] = useState<boolean>(false);
  const [player1, setPlayer1] = useState<string | null>(null);
  const [player2, setPlayer2] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  //@ts-ignore
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());


  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  function playSound() {
    new Audio(moveSound).play();
  }

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      if (message.type === SPECTATE) {
        setBoard(message.game);
        setPlayer1(message.player1);
        setPlayer2(message.player2);
        setStarted(true);
      }
      if (message.type === SPECTATE_UPDATE) {
        try {
          // setBoard(message.payload);
          game.load(message.payload)
          setBoard(game.board());
        } catch (e) {
          console.log(e);
        }
      }
    };
  }, [socket]);


  useEffect(() => {
    if (game.isGameOver()) {
      const gameWinner = game.turn() === "w" ? "black" : "white"
      setWinner(gameWinner);
    }
    playSound();

  }, [board])



  useEffect(() => {
    async function getGames() {
      const res = await axios.get(VITE_BACKEND_URL);
      //@ts-ignore
      setGames(res.data.games);
      //@ts-ignore
      console.log(res.data.games);
    }
    getGames();
  }, []);

  async function spectateMatch(gameId: string) {
    socket?.send(
      JSON.stringify({
        type: SPECTATE,
        gameId,
      })
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center z-20 relative justify-center min-h-[90vh]  playwrite-it-moderna-one"
      >
        {!isStarted ? (
          <div className="p-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Available Games</h2>
            <div>
              {(games?.length === 0) && <div className="flex flex-col gap-4">  <p className="text-white text-lg">No games available</p> <Link to={'/game'}  className="px-4 mt-3 py-2 text-2xl rounded-md border-black bg-black text-white libre-franklin-900" > Play </Link> </div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games?.map((game) => (
                <motion.div
                  key={game}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white p-5 rounded-lg shadow-lg border border-black"
                >
                  <p className="text-lg font-semibold">Game ID: {game}</p>
                  <button
                    onClick={() => spectateMatch(game)}
                    className="mt-3 px-5 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  >
                    Spectate
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <GameBoard board={board!} game={null} myColor="spectator" setBoard={null} socket={socket!} />
            <div className="flex flex-col justify-between items-center text-3xl font-black text-black">
              {!winner ? (
                <>
                  <div>{player2}</div>
                  <div className="">vs</div>
                  <div>{player1}</div>
                </>
              ) : (
                <div className="text-amber-500 text-4xl">{`${winner} wins the match`}</div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      <BackgroundBeams className='bg-neutral-950' />
    </div>
  );
}
