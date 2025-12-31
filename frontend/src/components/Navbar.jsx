import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

function Navbar() {
  const { socket } = useContext(SocketContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      setNotificationCount((prev) => prev + 1);
    };

    const handleNewMatch = () => {
      setNotificationCount((prev) => prev + 1);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newMatch", handleNewMatch);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newMatch", handleNewMatch);
    };
  }, [socket]);

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/opportunities"
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          textDecoration: "none",
          color: "#111827",
        }}
      >
        WasteZero Dashboard
      </Link>

      {/* 🔔 Notification Icon */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        🔔
        {notificationCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-10px",
              background: "red",
              color: "white",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "50%",
            }}
          >
            {notificationCount}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
