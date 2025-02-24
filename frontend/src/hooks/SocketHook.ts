import {  useEffect, useState } from "react"
import dotenv from "dotenv"
dotenv.config()

const WS_URL = process.env.VITE_WS_URL as string;

const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }

        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [])

    return socket;  
}
export default useSocket;