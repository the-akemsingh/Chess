import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >

      <div className="flex justify-center min-w-full">
        <div className="flex min-w-screen  flex-col">
          <div className="flex font-bold ml-auto mr-auto flex-col gap-3 md:mt-40 ">
            <div className=" flex gap-2 text-8xl ">
              <span className="playwrite-it-moderna-one">CHESS</span> <img src="/knight.png" alt="knight" width={90} height={20} />
            </div>
            <div className="ml-auto mr-auto p-2 text-amber-500 playwrite-it-moderna-one">
              think, dominate and conquer
            </div>
            <button onClick={() => navigate("/game")} className="px-4 playwrite-it-moderna-one py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Play
            </button>
            <button onClick={() => navigate("/spectate")} className="px-4 playwrite-it-moderna-one py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Spectate
            </button>
          </div>
          <div className="ml-auto -mt-24 -z-10 mr-auto">
            <img src="/chess-board.png" className="blur-sm" width={800} height={500} alt="chess-board" />
          </div>
        </div>
      </div>

    </motion.div>
  );
}
