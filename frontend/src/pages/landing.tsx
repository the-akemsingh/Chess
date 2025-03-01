import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Youtube, Quote, History } from 'lucide-react';

const ChessQuotes = [
  { quote: "Chess is life in miniature. Chess is a struggle, chess is battles.", author: "Garry Kasparov" },
  { quote: "Every chess master was once a beginner.", author: "Irving Chernev" },
  { quote: "Chess is the gymnasium of the mind.", author: "Blaise Pascal" }
];

const RecommendedVideos = [
  { title: "Chess Fundamentals", creator: "GothamChess", description: "Learn the basic principles of chess", link:"https://youtu.be/OCSbzArwB10" },
  { title: "Top 8 Chess Openings", creator: "GothamChess", description: "Master the most popular openings", link:"https://youtu.be/neUVoeBOH-4" },
  { title: "8 Unbelievable Endgames By Magnus Carlsen", creator: "GothamChess", description: "Essential endgame techniques", link:"https://youtu.be/tJIHFuHrZp4" }
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-screen bg-white px-4 md:px-8">
      <div className="flex flex-col items-center text-center mt-12 md:mt-20">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <h1 className="text-5xl md:text-8xl font-bold">CHESS</h1>
          <img src="/knight.png" alt="knight" className="w-16 md:w-24" />
        </div>
        <p className="text-lg md:text-xl text-amber-500 mt-2">Think, Dominate, and Conquer</p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button onClick={() => navigate("/game")} className="px-4 mt-3 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
            Play Now
          </button>
          <button onClick={() => navigate("/spectate")} className="px-4 mt-3 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
            Spectate
          </button>
        </div>
      </div>

      <motion.div key={currentQuote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto mt-16 p-6 text-center">
        <Quote className="w-8 h-8 mx-auto mb-4 text-amber-500" />
        <p className="text-xl md:text-2xl italic">{ChessQuotes[currentQuote].quote}</p>
        <p className="text-gray-600">- {ChessQuotes[currentQuote].author}</p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-16 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-amber-500" />
            <h2 className="text-xl font-bold">Chess History</h2>
          </div>
          <p className="text-gray-700">
            Chess originated in India around the 6th century AD, where it was known as Chaturanga. The game spread to Persia, evolved into Shatranj, and eventually reached Europe through the Moorish conquest of Spain.
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
                  <a className='text-blue-400' href={video.link} target='_blank' rel='noopener noreferrer'>Watch</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
