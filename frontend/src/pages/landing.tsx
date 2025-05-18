import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BackgroundBeams } from '../components/ui/background-beams';

export default function Landing() {

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-[90vh] bg-white px-4 md:px-8">
      <div className="flex relative z-20 flex-col items-center text-center pt-12 md:pt-20">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <h1 className="text-5xl md:text-7xl lg:text-9xl text-white libre-franklin-900 font-bold">Think, Dominate, Conquer.</h1>
          {/* <img src="/knight.png" alt="knight" className="w-16 md:w-24" /> */}
        </div>
        <p className="text-xl md:text-2xl cal-sans-regular text-amber-500 mt-10">Play with your friends. Spectate live matches.</p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link
            to="/game"
            className="px-4 mt-3 py-2 text-2xl rounded-md border-black bg-black text-white libre-franklin-900 "
          >
            Play Now
          </Link>

          <Link to={'/spectate'} className="px-4 mt-3 text-2xl py-2 border-black rounded-md border bg-black text-white libre-franklin-900">
            Spectate
          </Link>
        </div>
      </div>
      <BackgroundBeams className='bg-neutral-950 ' />
    </motion.div>
  );
}
