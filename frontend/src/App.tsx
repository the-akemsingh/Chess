import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./pages/game";
import Landing from "./pages/landing";
import Spectate from "./pages/spectate";
import SignInPage from "./pages/signIn";
import Navbar from "./components/Navbar";

function App() {

  const Router = createBrowserRouter([
    {
      path: "/",
      element: <>
        <Navbar></Navbar>
        <Landing></Landing>
      </>
    },
    {
      path: "/signin",
      element: <>
        <Navbar></Navbar>
        <SignInPage></SignInPage>
      </>
    },
    {
      path: "/game",
      element: <>
        <Navbar></Navbar>
        <Game></Game>
      </>
    },
    {
      path: "/spectate",
      element: <>
        <Navbar></Navbar>
        <Spectate></Spectate>
      </>
    }
  ])

  return <RouterProvider router={Router}></RouterProvider>
}

export default App;