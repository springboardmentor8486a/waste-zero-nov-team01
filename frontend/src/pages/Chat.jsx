import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';


const Chat = () => {
  const { receiverId } = useParams();
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState("User");
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  // Initialize currentUser from localStorage and fetch ID if missing
  useEffect(() => {
    const initializeUser = async () => {
      let user = JSON.parse(localStorage.getItem('wastezero_user'));
      
      // If user exists but is missing ID, fetch it from API
      if (user && !user.id) {
        try {
          const token = localStorage.getItem('wastezero_token');
          const res = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data) {
            user = {
              ...user,
              id: res.data._id || res.data.id
            };
            localStorage.setItem('wastezero_user', JSON.stringify(user));
          }
        } catch (err) {
          console.error('Failed to fetch current user:', err);
        }
      }
      
      setCurrentUser(user);
    };
    
    initializeUser();
  }, []); 

  // Fetch messages function - extracted for reusability
  const fetchChatHistory = async () => {
    if (!currentUser || !receiverId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('wastezero_token');
      const res = await axios.get(`http://localhost:5000/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
      console.log("Chat history fetched:", res.data?.length || 0, "messages");
      
      // Try to extract other user's name from messages
      if (res.data && res.data.length > 0) {
        const firstMsg = res.data[0];
        const otherUser = firstMsg.receiver_id?.name || firstMsg.sender_id?.name;
        if (otherUser) {
          setOtherUserName(otherUser);
        }
      }
    } catch (err) {
      console.error('Failed to load messages', err.response?.data || err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch other user's profile details
  const fetchOtherUserDetails = async () => {
    if (!receiverId) return;
    
    try {
      const token = localStorage.getItem('wastezero_token');
      const res = await axios.get(`http://localhost:5000/api/users/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.name) {
        setOtherUserName(res.data.name);
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      // Will try to get name from messages instead
    }
  };

  // Fetch messages every time receiverId or currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchChatHistory();
      fetchOtherUserDetails();
    }
  }, [receiverId, currentUser]);

  // Socket listener for real-time new messages
  useEffect(() => {
    if (!socket || !currentUser) return;

    const onNewMessage = (data) => {
      // Only append messages that belong to this conversation
      const participantIds = [String(data.sender_id), String(data.receiver_id)];
      if (participantIds.includes(String(receiverId))) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('newMessage', onNewMessage);

    return () => {
      socket.off('newMessage', onNewMessage);
    };
  }, [socket, receiverId, currentUser]);

  // Auto-Scroll to Latest Message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('wastezero_token');
      const payload = {
        receiver_id: receiverId,
        content: newMessage,
      };

      const res = await axios.post(`http://localhost:5000/api/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // server returns saved message; append to UI
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");

      // Optionally emit to server if you want optimistic realtime propagation (server already emits on save)
      if (socket && socket.connected) {
        socket.emit('outgoingMessage', res.data);
      }
    } catch (err) {
      console.error("Message send error:", err.response?.data || err.message);
      alert("Message failed to send. Check console.");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-50 rounded-xl shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 bg-emerald-600 text-white rounded-t-xl font-bold flex justify-between items-center">
        <span>Chat with {otherUserName}</span>
        <button
          onClick={fetchChatHistory}
          disabled={loading}
          className="text-sm bg-emerald-700 hover:bg-emerald-800 px-3 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh chat history"
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = String(msg.sender_id) === String(currentUser?.id) || 
                                  String(msg.sender_id?._id) === String(currentUser?.id) ||
                                  String(msg.sender_id) === String(currentUser?._id);
            // format timestamp into separate date and time strings
            const ts = new Date(msg.timestamp || msg.createdAt || Date.now());
            const formattedTime = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedDate = ts.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div 
                key={msg._id || index} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs p-3 rounded-2xl text-sm shadow-md transition-all ${
                  isCurrentUser 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}>
                  <p className="break-words">{msg.content || msg.text}</p>
                  <p className={`text-[11px] mt-1.5 opacity-70 text-right ${isCurrentUser ? 'text-emerald-100' : 'text-gray-600'}`} title={ts.toLocaleString()}>
                    <span className="block">{formattedTime}</span>
                    <span className="block text-[10px] opacity-60">{formattedDate}</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input + Send Button */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-xl flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-all">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;