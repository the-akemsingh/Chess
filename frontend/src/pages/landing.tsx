import { useNavigate } from "react-router-dom"

export default function Landing(){
    const navigate=useNavigate();
    return <div className="grid-cols-2 min-h-screen  min-w-full flex">
        <div className="col-span-1  pt-24  w-full">
            <img height={500} width={500} className="m-auto" src="/chess-board.png" alt="board" />
        </div>
        <div className=" w-full pt-24  col-span-1">
            <div className="flex flex-col">
            <div className="text-4xl font-bold">Play Chess Online on the #1 Site!</div>
            <button onClick={()=>{
                navigate("/game");
            }} className="bg-green-600 mt-5 p-3 max-w-52 hover:bg-green-900 text-white text-3xl font-bold  rounded-sm">Start Game</button>

            <div className="text-2xl font-bold mt-10">Watch others players</div>
            <button onClick={()=>{
                navigate("/spectate");
            }} className="bg-green-600 mt-4 p-1 max-w-28 hover:bg-green-900 text-white text-xl font-bold  rounded-sm">Spectate</button>
            </div>
        </div>
    </div>
}