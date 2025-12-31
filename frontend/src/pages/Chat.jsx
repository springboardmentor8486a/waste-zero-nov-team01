// src/pages/Chat.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";
import "./Chat.css"; // optional styling

const Chat = () => {
  const { user } = useAuth(); // current logged-in user
  const { socket } = useSocket();
  const { userId: otherUserId } = useParams(); // ID of the person we chat with
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load previous messages
  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/messages/${user.email}/${otherUserId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user, otherUserId]);

  // Listen to new messages from socket
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      // Only add messages related to this chat
      if (
        (msg.sender_id === user.email && msg.receiver_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.receiver_id === user.email)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, user, otherUserId]);

  // Scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      sender_id: user.email,
      receiver_id: otherUserId,
      content: input.trim(),
    };

    try {
      // POST to backend
      const res = await api.post("/messages", messageData);
      const savedMessage = res.data;

      // Update UI
      setMessages((prev) => [...prev, savedMessage]);

      // Emit socket event
      socket?.emit("sendMessage", {
        from: user.email,
        to: otherUserId,
        content: savedMessage.content,
        timestamp: savedMessage.timestamp,
      });

      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id || msg.timestamp}
            className={`message ${
              msg.sender_id === user.email ? "sent" : "received"
            }`}
          >
            <div className="content">{msg.content}</div>
            <div className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
