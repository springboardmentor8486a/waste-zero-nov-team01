import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch inbox function - extracted for reusability
  const fetchInbox = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wastezero_token');
      if (!token) {
        console.error("Token missing!");
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Conversations Data:", response.data);
      setConversations(response.data || []);
    } catch (error) {
      console.error("Inbox load error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inbox on component mount and when user returns to this page
  useEffect(() => {
    fetchInbox();
    
    // Optional: Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchInbox, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Inbox...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '0', fontWeight: 'bold', color: '#333' }}>Your Messages</h2>
        <button
          onClick={fetchInbox}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
          title="Refresh conversations"
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>
      
      {conversations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px', background: '#fff' }}>
          <p style={{ color: '#888' }}>No recent conversations found.</p>
          <button 
            onClick={() => navigate('/matches')} 
            style={{ marginTop: '10px', padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Start a chat from Matches
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conversations.map((chat, index) => (
            <div 
              key={chat.otherUserId || index}
              onClick={() => navigate(`/chat/${chat.otherUserId}`)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                border: '1px solid #eee',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {/* Profile Circle */}
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  background: '#007bff', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '18px'
                }}>
                  {chat.otherUserName?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{chat.otherUserName || "User"}</div>
                  <div style={{ 
                    fontSize: '14px', color: '#666', 
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' 
                  }}>
                    {chat.lastMessage?.text || "No messages yet"}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;