import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Announcement, AnnouncementTitle } from "../components/ui/announcement";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 sm:pt-24 md:pt-28 bg-neutral-950 relative"
      style={{
        backgroundImage: `url('/images/landingPageBG.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(200px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex relative z-20 flex-col items-center text-center pt-8 sm:pt-10 md:pt-16 px-4 sm:px-6 md:px-8"
      >
        <motion.div variants={itemVariants}>
          <Announcement className="bg-white mb-5 sm:mb-7">
            <AnnouncementTitle >
              <span className="p-1 libre-franklin-900 sm:text-sm text-base ">
                Train your mind ⚡
              </span>
            </AnnouncementTitle>
          </Announcement>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-3 sm:gap-4 flex-col">
          <h1 className="text-2xl sm:text-3xl border p-1 border-white md:text-5xl lg:text-7xl text-white libre-franklin-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">Master Your Game.</h1>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl text-white libre-franklin-900">Play Chess Online.</h1>
        </motion.div>
        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl lg:text-2xl cal-sans-regular p-2 sm:p-4 text-amber-500 mt-6 sm:mt-8 md:mt-10">Join millions of players from around the world on the leading online <br className="hidden sm:block" /> chess platform. Play, learn, and grow your skills.</motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-4 sm:mt-6 flex flex-col md:flex-row gap-3 sm:gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/game"
              className="px-3 sm:px-4 py-1 sm:py-2 text-lg sm:text-xl md:text-2xl rounded-md border border-black bg-black text-white libre-franklin-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] inline-block"
            >
              Play Now
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={'/spectate'} className="px-3 sm:px-4 py-1 sm:py-2 text-lg sm:text-xl md:text-2xl rounded-md border border-black bg-white text-black libre-franklin-900 shadow-[2px_2px_0px_0px_rgba(255,255,1)] sm:shadow-[4px_4px_0px_0px_rgba(255,255,1)] inline-block">
              Spectate
            </Link>
          </motion.div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
