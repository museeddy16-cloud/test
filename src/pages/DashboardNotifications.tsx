import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Menu } from 'lucide-react';
import { getApiUrl } from '../config/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardNotifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/notifications'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/notifications/${id}/read`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl('/notifications/read-all'), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/notifications/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return 'Yesterday';
    return d.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking': return '#28a745';
      case 'message': return '#17a2b8';
      case 'review': return '#ffc107';
      case 'alert': return '#dc3545';
      default: return 'var(--primary)';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
        </header>

        <div className="dashboard-content">
          <div className="notifications-container">
            {loading ? (
              <div className="loading-state">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state-card">
                <Bell size={48} />
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-card ${notification.isRead ? '' : 'unread'}`}
                  >
                    <div 
                      className="notification-indicator"
                      style={{ backgroundColor: getTypeColor(notification.type) }}
                    ></div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h3>{notification.title}</h3>
                        <span className="notification-time">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p>{notification.message}</p>
                    </div>
                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button 
                          className="action-btn read"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-header {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          margin-left: auto;
        }
        
        .mark-all-btn:hover {
          background: var(--primary-dark);
        }
        
        .notifications-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .loading-state {
          text-align: center;
          padding: 60px;
          color: var(--text-light);
        }
        
        .empty-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          background: var(--bg-white);
          border-radius: 12px;
          text-align: center;
          color: var(--text-light);
        }
        
        .empty-state-card h3 {
          margin: 16px 0 8px;
          color: var(--text-dark);
        }
        
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .notification-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: var(--bg-white);
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
        }
        
        .notification-card.unread {
          background: rgba(26, 59, 143, 0.03);
          border-left: 3px solid var(--primary);
        }
        
        .notification-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .notification-header h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
        }
        
        .notification-time {
          font-size: 12px;
          color: var(--text-light);
          white-space: nowrap;
        }
        
        .notification-content p {
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.5;
        }
        
        .notification-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: var(--bg-light);
          color: var(--text-light);
        }
        
        .action-btn:hover {
          background: var(--border-color);
        }
        
        .action-btn.read:hover {
          background: #d4edda;
          color: #155724;
        }
        
        .action-btn.delete:hover {
          background: #f8d7da;
          color: #721c24;
        }
        
        @media (max-width: 640px) {
          .mark-all-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
