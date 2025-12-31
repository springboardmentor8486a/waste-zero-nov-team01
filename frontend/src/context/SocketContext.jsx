import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

// ✅ Named export
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit("registerUser", {
      userId: user._id || user.email,
      role: user.role,
    });
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Named export
export const useSocket = () => useContext(SocketContext);
