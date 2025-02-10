import {  createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./pages/game";
import Landing from "./pages/landing";

function App() {

  const Router= createBrowserRouter([
    {
      path:"/",
      element:<Landing></Landing>
    },
    {
      path:"/game",
      element:<Game></Game>
    }
  ])
  
  return <RouterProvider router={Router}></RouterProvider>
}

export default App;