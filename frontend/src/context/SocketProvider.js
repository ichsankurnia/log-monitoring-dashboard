import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { baseURL } from '../api'

const BASE_URL = baseURL
const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
    const [socket, setSocket] = useState()

    useEffect(() => {
        const newSocket = io(
            BASE_URL,
            { query: { id } }
        )
        setSocket(newSocket)

        newSocket.on('first-login', (data) => {
            console.info('MY SOCKET INFO :', data)
        })

        return () => newSocket.close()
    }, [id])                                                // Jalankan useeffect setiap ada perubahan pada params id

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext