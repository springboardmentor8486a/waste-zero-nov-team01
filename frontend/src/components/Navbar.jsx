import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('wastezero_user'));
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!user?._id || !socket) return;

    // Real-time message notification logic; backend emits 'newMessage'
    const onNewMessage = (data) => {
      // If user is not currently on that chat, show notification
      if (!window.location.pathname.includes(`/chat/${data.sender_id}`)) {
        setNotifications((prev) => [
          {
            id: Date.now(),
            senderId: data.sender_id,
            text: `New message: ${String(data.content || '').substring(0, 20)}...`,
            type: 'message'
          },
          ...prev
        ]);
      }
    };

    socket.on('newMessage', onNewMessage);

    return () => socket.off('newMessage', onNewMessage);
  }, [user, socket]);

  return (
    <nav style={{ background: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1000 }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#10b981', cursor: 'pointer' }} onClick={() => navigate('/')}>
        WasteZero
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* 🔹 Notification Bell Icon */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
          <span style={{ fontSize: '24px' }}>🔔</span>
          {notifications.length > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
              {notifications.length}
            </span>
          )}

          {/* 🔹 Notification Dropdown UI */}
          {showDropdown && (
            <div style={{ position: 'absolute', top: '35px', right: '0', background: '#fff', border: '1px solid #eee', borderRadius: '8px', width: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold', fontSize: '14px', background: '#f9fafb' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        setNotifications(notifications.filter(n => n.id !== notif.id));
                        navigate(`/chat/${notif.senderId}`);
                      }}
                      style={{ padding: '12px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = '#fff'}
                    >
                      <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>{notif.text}</p>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>Just now</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <span style={{ fontSize: '14px', fontWeight: '500' }}>{user?.name}</span>
      </div>
    </nav>
  );
};

export default Navbar;