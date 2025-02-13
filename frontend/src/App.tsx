import {  createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./pages/game";
import Landing from "./pages/landing";
import Spectate from "./pages/spectate";

function App() {

  const Router= createBrowserRouter([
    {
      path:"/",
      element:<Landing></Landing>
    },
    {
      path:"/game",
      element:<Game></Game>
    },
    {
      path:"/spectate",
      element:<Spectate></Spectate>
    }
  ])
  
  return <RouterProvider router={Router}></RouterProvider>
}

export default App;