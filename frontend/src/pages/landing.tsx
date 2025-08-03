import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Announcement, AnnouncementTitle } from "../components/ui/announcement";

export default function Landing() {

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-screen bg-neutral-950">
      <div className="flex relative z-20 flex-col items-center text-center pt-12 md:pt-20">
        <Announcement className=" mb-7">
          <AnnouncementTitle >
            <span className="p-1 text-white libre-franklin-900 text-xl">
              Train your mind ✨
            </span>
          </AnnouncementTitle>
        </Announcement>
        <div className="flex gap-4 flex-col">
          <h1 className="text-3xl border p-1 border-white md:text-6xl  text-white libre-franklin-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ">Master Your Game.</h1>
          <h1 className="text-3xl md:text-6xl  text-white libre-franklin-900 ">Play Chess Online.</h1>
        </div>
        <p className="text-xl md:text-2xl cal-sans-regular p-4 text-amber-500 mt-10">Join millions of players from around the world on the leading online <br /> chess platform. Play, learn, and grow your skills.</p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link
            to="/game"
           className="px-4 mt-3 py-2 text-2xl rounded-md border border-black bg-black text-white libre-franklin-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition duration-100 ease-in-out transform hover:scale-105"
          >
            Play Now
          </Link>

          <Link to={'/spectate'} className="px-4 mt-3 text-2xl py-2 border-black rounded-md border bg-white text-black libre-franklin-900 shadow-[4px_4px_0px_0px_rgba(255,255,1)] transition duration-100 ease-in-out transform hover:scale-105">
            Spectate
          </Link>
        </div>
      </div>
      {/* <div className="mt-20 bg-white min-h-24 flex flex-col items-center justify-center ">
        <span className="text-xl md:text-3xl libre-franklin-900 ">Ready to make your move?</span>
      </div> */}
    </motion.div>
  );
}
