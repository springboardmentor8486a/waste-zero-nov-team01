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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#333', fontSize: '14px' }}>💬 Loading Inbox...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto', backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ 
            marginBottom: '4px', 
            fontWeight: 'bold', 
            fontSize: '28px',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a202c',
            background: document.documentElement.classList.contains('dark') ? 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)' : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            💬 Your Messages
          </h1>
          <p style={{ fontSize: '13px', color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#718096', margin: 0 }}>
            {conversations.length === 0 ? 'No conversations yet' : `${conversations.length} active conversation${conversations.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={fetchInbox}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: document.documentElement.classList.contains('dark') 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            boxShadow: document.documentElement.classList.contains('dark') ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}
          onMouseOver={(e) => !loading && (
            e.target.style.transform = 'translateY(-2px)',
            e.target.style.boxShadow = document.documentElement.classList.contains('dark') 
              ? '0 6px 16px rgba(16, 185, 129, 0.4)' 
              : '0 4px 12px rgba(16, 185, 129, 0.3)'
          )}
          onMouseOut={(e) => !loading && (
            e.target.style.transform = 'translateY(0)',
            e.target.style.boxShadow = document.documentElement.classList.contains('dark') 
              ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
              : '0 2px 8px rgba(16, 185, 129, 0.2)'
          )}
          title="Refresh conversations"
        >
          {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      
      {conversations.length === 0 ? (
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center', 
          border: `2px dashed ${document.documentElement.classList.contains('dark') ? '#334155' : '#cbd5e1'}`, 
          borderRadius: '12px', 
          background: document.documentElement.classList.contains('dark') 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
            : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#4a5568', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>No recent conversations found</p>
          <p style={{ color: document.documentElement.classList.contains('dark') ? '#64748b' : '#718096', fontSize: '13px', marginBottom: '20px' }}>Start a conversation to connect with others</p>
          <button 
            onClick={() => navigate('/matches')} 
            style={{ 
              padding: '12px 24px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
            onMouseOver={(e) => (
              e.target.style.transform = 'translateY(-2px)',
              e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
            )}
            onMouseOut={(e) => (
              e.target.style.transform = 'translateY(0)',
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
            )}
          >
            🎯 Start a Chat from Matches
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {conversations.map((chat, index) => (
            <div 
              key={chat.otherUserId || index}
              onClick={() => navigate(`/chat/${chat.otherUserId}`)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: document.documentElement.classList.contains('dark')
                  ? 'linear-gradient(135deg, #0f1a2e 0%, #050c1a 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                borderRadius: '12px',
                boxShadow: document.documentElement.classList.contains('dark')
                  ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                border: `1.5px solid ${document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0'}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '0 8px 20px rgba(16, 185, 129, 0.15)'
                  : '0 6px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = document.documentElement.classList.contains('dark') ? '#10b981' : '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                {/* Profile Circle with Gradient */}
                <div style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} 0%, ${['#1d4ed8', '#6d28d9', '#be185d', '#d97706', '#059669'][index % 5]} 100%)`,
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(245, 158, 11, 0.3)', 'rgba(16, 185, 129, 0.3)'][index % 5]}`,
                }}>
                  {chat.otherUserName?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1a202c', fontSize: '15px', marginBottom: '4px' }}>
                    {chat.otherUserName || "User"}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#718096', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
                    {chat.lastMessage?.text || "👋 No messages yet"}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', flexShrink: 0, marginLeft: '12px' }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: document.documentElement.classList.contains('dark') ? '#64748b' : '#a0aec0',
                  fontWeight: '500'
                }}>
                  {chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </span>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  marginTop: '6px',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;