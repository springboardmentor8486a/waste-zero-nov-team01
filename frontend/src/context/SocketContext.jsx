import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Don't connect if no user
    if (!user || !user._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Get fresh token each time
    const token = localStorage.getItem("wastezero_token");
    if (!token) {
      console.warn("No token available for socket connection");
      return;
    }

    // Create socket connection
    const s = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    s.on("connect", () => {
      console.log("socket connected", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("socket connect_error:", err.message);
    });

    setSocket(s);

    // Cleanup
    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("connect_error");
      s.disconnect();
    };
  }, [user?._id]); // Only depend on user._id, not the entire user object

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};