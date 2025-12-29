import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { userId } = useParams();          // other user (NGO or volunteer)
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]); // { _id, from, to, text, createdAt }
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initial fetch + socket listeners
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("wastezero_token");
        const res = await fetch(
          `http://localhost:5000/api/messages/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Fetch chat history error:", err);
      }
    };

    fetchHistory();

    if (!socket) return;

    // join private room
    socket.emit("joinConversation", { otherUserId: userId });

    // listen for new messages
    const handler = (msg) => {
      // only push if this conversation
      if (
        (msg.from === user._id && msg.to === userId) ||
        (msg.from === userId && msg.to === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
      socket.emit("leaveConversation", { otherUserId: userId });
    };
  }, [socket, userId, user?._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const msg = {
      from: user._id,
      to: userId,
      text,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI
    setMessages((prev) => [...prev, msg]);

    setInput("");

    try {
      const token = localStorage.getItem("wastezero_token");
      await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(msg),
      });

      // realtime emit
      if (socket) {
        socket.emit("sendMessage", msg);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="flex flex-col h-full max-h-screen bg-white rounded-xl border">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Conversation
          </p>
          <p className="text-xs text-gray-500">
            Real-time chat between volunteer and NGO
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {messages.map((m) => {
          const isMine = m.from === user._id;
          return (
            <div
              key={m._id || m.createdAt + m.text}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  isMine
                    ? "bg-emerald-500 text-white rounded-br-sm"
                    : "bg-white text-gray-900 rounded-bl-sm"
                }`}
              >
                <p>{m.text}</p>
                <span className="mt-1 block text-[10px] opacity-70 text-right">
                  {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t px-3 py-2 flex items-center gap-2 bg-white"
      >
        <input
          type="text"
          className="flex-1 rounded-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;