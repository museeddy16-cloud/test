import { MessageSquare, Send, Paperclip, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const conversations = [
  { id: 1, name: 'John Smith', lastMessage: 'Is early check-in possible?', timestamp: '2 hours ago', unread: true, avatar: 'JS' },
  { id: 2, name: 'Sarah Johnson', lastMessage: 'Thanks for the quick response!', timestamp: '5 hours ago', unread: false, avatar: 'SJ' },
  { id: 3, name: 'Mike Williams', lastMessage: 'Looking forward to my stay!', timestamp: '1 day ago', unread: false, avatar: 'MW' },
  { id: 4, name: 'Emily Brown', lastMessage: 'What time is check-in?', timestamp: '2 days ago', unread: false, avatar: 'EB' },
  { id: 5, name: 'David Lee', lastMessage: 'Perfect, see you soon!', timestamp: '3 days ago', unread: false, avatar: 'DL' },
];

const messages = [
  { id: 1, sender: 'John Smith', text: 'Hi! I\'m interested in your Modern Beach House', time: '2 hours ago', own: false },
  { id: 2, sender: 'You', text: 'Hello! Sure, what would you like to know?', time: '2 hours ago', own: true },
  { id: 3, sender: 'John Smith', text: 'Is early check-in possible?', time: '1 hour ago', own: false },
];

export default function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filtered = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <div className="host-dashboard-badge">Host Dashboard</div>
        <div className="messages-container">
          <div className="messages-sidebar">
            <div className="messages-header">
              <h2>Messages</h2>
              <MessageSquare size={24} />
            </div>

            <div className="messages-search">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {filtered.map((conv) => (
                <div 
                  key={conv.id} 
                  className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="conv-avatar">{conv.avatar}</div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.name}</div>
                    <div className="conv-message">{conv.lastMessage}</div>
                  </div>
                  <span className="conv-time">{conv.timestamp}</span>
                  {conv.unread && <span className="unread-indicator"></span>}
                </div>
              ))}
            </div>
          </div>

          <div className="messages-main">
            {selectedConversation ? (
              <>
                <div className="message-thread-header">
                  <button 
                    className="btn-icon"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h3>{conversations.find(c => c.id === selectedConversation)?.name}</h3>
                </div>

                <div className="message-thread">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.own ? 'own' : ''}`}>
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="message-input-area">
                  <div className="message-input-field">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="btn-icon">
                      <Paperclip size={20} />
                    </button>
                    <button className="btn-primary-small">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-conversation">
                <MessageSquare size={64} />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
