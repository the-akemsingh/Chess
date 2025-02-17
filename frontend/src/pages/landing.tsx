import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="grid-cols-2 min-h-screen min-w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8}}
    >
      {/* Chessboard Image Section */}
      <motion.div
        className="col-span-1 w-full flex justify-center items-center bg-gray-950"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img
          height={500}
          width={500}
          className="m-auto drop-shadow-lg"
          src="/chess-board.png"
          alt="board"
        />
      </motion.div>

      {/* Text and Buttons Section */}
      <motion.div
        className="w-full col-span-1 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center p-10 shadow-lg"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-4xl font-bold text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Play Chess Online on the #1 Site!
        </motion.div>

        {/* Start Game Button */}
        <motion.button
          onClick={() => navigate("/game")}
          className="bg-green-600 mt-5 p-3 max-w-52 hover:bg-green-900 text-white text-3xl font-bold rounded-lg shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Start Game
        </motion.button>

        {/* Spectate Section */}
        <motion.div
          className="text-2xl font-bold mt-10 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Watch other players
        </motion.div>

        {/* Spectate Button */}
        <motion.button
          onClick={() => navigate("/spectate")}
          className="bg-green-600 mt-4 p-2 max-w-28 hover:bg-green-900 text-white text-xl font-bold rounded-lg shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Spectate
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
