import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./pages/game";
import Landing from "./pages/landing";
import Spectate from "./pages/spectate";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

// Page transition wrapper component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <>
        <Navbar />
        <PageTransition>
          <Landing />
        </PageTransition>
      </>
    },
    {
      path: "/game",
      element: <>
        <Navbar />
        <PageTransition>
          <Game />
        </PageTransition>
      </>
    },
    {
      path: "/spectate",
      element: <>
        <Navbar />
        <PageTransition>
          <Spectate />
        </PageTransition>
      </>
    }
  ])

  return <RouterProvider router={Router}></RouterProvider>
}

export default App;