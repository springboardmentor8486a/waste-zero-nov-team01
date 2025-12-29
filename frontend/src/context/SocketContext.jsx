import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // user login ayyaka matrame connect
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem("wastezero_token");

    const s = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    s.on("connect", () => {
      console.log("socket connected", s.id);
      // user-specific room
      s.emit("registerUser", { userId: user._id });
    });

    s.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("socket connect_error:", err.message);
    });

    setSocket(s);

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("connect_error");
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};