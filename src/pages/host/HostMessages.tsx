import { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, User } from 'lucide-react';
import { useFetch, usePost } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { Conversation, Message } from '../../types/dashboard';

export default function HostMessages() {
  const { data: conversations, loading } = useFetch<Conversation[]>('/host/conversations');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { post, loading: sending } = usePost();

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/host/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Failed to load messages');
    }
    setMessagesLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const result = await post(`/host/conversations/${selectedConversation.id}/messages`, {
      content: newMessage,
    });

    if (result) {
      setMessages([...messages, result as Message]);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations?.filter((conv) =>
    conv.participants.some((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading messages..." />;
  }

  return (
    <div className="host-messages">
      <div className="messages-container">
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
          </div>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const otherParticipant = conv.participants.find(
                  (p) => p.id !== localStorage.getItem('userId')
                ) || conv.participants[0];
                return (
                  <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="participant-avatar">
                      {otherParticipant.avatar ? (
                        <img src={otherParticipant.avatar} alt={otherParticipant.firstName} />
                      ) : (
                        <span>{otherParticipant.firstName?.charAt(0) || 'G'}</span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{otherParticipant.firstName} {otherParticipant.lastName}</h4>
                        <span className="time">{formatTime(conv.updatedAt)}</span>
                      </div>
                      <p className="last-message">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-participant">
                  <div className="participant-avatar">
                    <User size={20} />
                  </div>
                  <div>
                    <h3>
                      {selectedConversation.participants
                        .find((p) => p.id !== localStorage.getItem('userId'))?.firstName || 'Guest'}
                    </h3>
                    <span className="listing-info">
                      {selectedConversation.listingId && 'Regarding listing'}
                    </span>
                  </div>
                </div>
                <button className="btn-icon">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="messages-area">
                {messagesLoading ? (
                  <LoadingSpinner message="Loading messages..." />
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <p>Start a conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${msg.senderId === localStorage.getItem('userId') ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input" onSubmit={handleSendMessage}>
                <button type="button" className="btn-icon">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newMessage.trim() || sending === 'loading'}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
