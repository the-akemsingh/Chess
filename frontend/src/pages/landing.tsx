import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Youtube, Quote, History } from 'lucide-react';

const ChessQuotes = [
  {
    quote: "Chess is life in miniature. Chess is a struggle, chess is battles.",
    author: "Garry Kasparov"
  },
  {
    quote: "Every chess master was once a beginner.",
    author: "Irving Chernev"
  },
  {
    quote: "Chess is the gymnasium of the mind.",
    author: "Blaise Pascal"
  }
];

const RecommendedVideos = [
  {
    title: "Chess Fundamentals",
    creator: "GothamChess",
    description: "Learn the basic principles of chess",
    link:"https://youtu.be/OCSbzArwB10?si=bmzgIZNGK8guUer9"
  },
  {
    title: "Top 8 Chess Openings",
    creator: "GothamChess",
    description: "Master the most popular openings",
    link:"https://youtu.be/neUVoeBOH-4?si=ctRjTutI5PjB02Tt"
  },
  {
    title: "8 Unbelievable Endgames By Magnus Carlsen",
    creator: "GothamChess",
    description: "Essential endgame techniques",
    link:"https://youtu.be/tJIHFuHrZp4?si=CwwgYuiwhvI3ybPm"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % ChessQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white"
    >
      <div className="flex justify-center min-w-full relative">
        <div className="flex min-w-screen flex-col">
          <div className="flex font-bold ml-auto mr-auto flex-col gap-3 md:mt-20">
            <div className="flex gap-2 text-8xl">
              <span className="playwrite-it-moderna-one">CHESS</span>
              <img src="/knight.png" alt="knight" width={90} height={20} />
            </div>
            <div className="ml-auto mr-auto p-2 text-amber-500 playwrite-it-moderna-one">
              think, dominate and conquer
            </div>
            <div className="flex ml-auto mr-auto gap-4">
              <button
                onClick={() => navigate("/game")}
                className="px-6 py-3 playwrite-it-moderna-one rounded-md border-2 border-black bg-black text-white text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:bg-white hover:text-black transition duration-200"
              >
                Play Now
              </button>
              <button
                onClick={() => navigate("/spectate")}
                className="px-6 py-3 playwrite-it-moderna-one rounded-md border-2 border-black bg-white text-black text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Spectate
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto mt-16 p-6 text-center"
        key={currentQuote}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Quote className="w-8 h-8 mx-auto mb-4 text-amber-500" />
        <p className="text-2xl italic mb-2">{ChessQuotes[currentQuote].quote}</p>
        <p className="text-gray-600">- {ChessQuotes[currentQuote].author}</p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-16 p-6 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-amber-500" />
              <h2 className="text-xl font-bold">Chess History</h2>
            </div>
            <p className="text-gray-700">
              Chess originated in India around the 6th century AD, where it was known as Chaturanga. The game spread to Persia, evolved into Shatranj, and eventually reached Europe through the Moorish conquest of Spain. By 1500, the game had evolved into essentially its current form, with the queen becoming the most powerful piece.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-amber-500" />
              <h2 className="text-xl font-bold">Recommended Videos</h2>
            </div>
            <div className="space-y-4">
              {RecommendedVideos.map((video, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Youtube className="w-5 h-5 mt-1 text-red-600" />
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-600">by {video.creator}</p>
                    <a className='text-blue-400' href={`${video.link}`} target='_blank' >visit</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </motion.div>
  );
}