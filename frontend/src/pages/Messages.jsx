import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

// Static styles — outside component so never re-created
const STATIC_STYLES = `
  @media (max-width: 768px) {
    .messages-container { height: calc(100vh - 160px) !important; padding: 12px !important; }
    .messages-desktop { display: none !important; }
    .mobile-back-btn { display: block !important; }
  }
  @media (min-width: 769px) {
    .mobile-only { display: none !important; }
    .mobile-back-btn { display: none !important; }
  }
`;

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const currentConvIdRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const convId = params.get("conv");
    if (convId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === parseInt(convId));
      if (conv) {
        setActiveConv(conv);
        setShowChat(true);
      }
    }
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConv) return;
    // Don't reconnect if same conversation
    if (currentConvIdRef.current === activeConv.id) return;
    currentConvIdRef.current = activeConv.id;

    fetchMessages(activeConv.id);

    if (ws.current) {
      ws.current.onmessage = null;
      ws.current.onerror = null;
      ws.current.close();
      ws.current = null;
    }
    const token = localStorage.getItem("access_token");
    const socket = new WebSocket(
      `${WS_URL}/ws/chat/${activeConv.id}/?token=${encodeURIComponent(token)}`,
    );
    socket.onopen = () =>
      console.log(`WS connected to conversation ${activeConv.id}`);
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id
            ? { ...c, last_message: { content: msg.content }, unread_count: 0 }
            : c,
        ),
      );
    };
    socket.onerror = (e) => console.error("WS error", e);
    socket.onclose = () =>
      console.log(`WS disconnected from conversation ${activeConv.id}`);
    ws.current = socket;
    return () => {
      currentConvIdRef.current = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.close();
      ws.current = null;
    };
  }, [activeConv?.id]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/messaging/conversations/");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/messaging/conversations/${convId}/`);
      setMessages(res.data);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !ws.current) return;
    if (ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify({ content: newMessage.trim() }));
    setNewMessage("");
  }, [newMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const handleSelectConv = useCallback((conv) => {
    setMessages([]);
    setActiveConv(conv);
    setShowChat(true);
  }, []);

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diff = Math.floor((new Date() - date) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
  };

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count || 0),
    0,
  );

  // Conversation list JSX
  const conversationListJSX = (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #F3F4F6",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ padding: "16px", borderBottom: "1px solid #F3F4F6" }}>
        <p style={{ color: "#111827", fontSize: "13px", fontWeight: 700 }}>
          Conversations
        </p>
      </div>

      {loading && (
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#F3F4F6",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: "12px",
                    background: "#F3F4F6",
                    borderRadius: "4px",
                    width: "60%",
                    marginBottom: "6px",
                  }}
                />
                <div
                  style={{
                    height: "10px",
                    background: "#F9FAFB",
                    borderRadius: "4px",
                    width: "80%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "4px",
            }}
          >
            No messages yet
          </p>
          <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
            Start a conversation from a job listing or application
          </p>
        </div>
      )}

      <div style={{ overflowY: "auto", flex: 1 }}>
        {conversations.map((conv) => {
          const other = conv.other_participant;
          const isActive = activeConv?.id === conv.id;
          return (
            <div
              key={conv.id}
              onClick={() => handleSelectConv(conv)}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                background: isActive ? "#EFF6FF" : "transparent",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                borderBottom: "1px solid #F9FAFB",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      other?.role === "employer"
                        ? "linear-gradient(135deg, #6D28D9, #8B5CF6)"
                        : "linear-gradient(135deg, #1E40AF, #3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "15px",
                  }}
                >
                  {other?.full_name?.[0]?.toUpperCase() ||
                    other?.email?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "3px",
                    }}
                  >
                    <p
                      style={{
                        color: "#111827",
                        fontSize: "13px",
                        fontWeight: conv.unread_count > 0 ? 700 : 500,
                      }}
                    >
                      {other?.full_name || other?.email}
                    </p>
                    <span
                      style={{
                        color: "#9CA3AF",
                        fontSize: "11px",
                        flexShrink: 0,
                      }}
                    >
                      {conv.last_message ? formatDate(conv.updated_at) : ""}
                    </span>
                  </div>
                  {conv.job_title && (
                    <p
                      style={{
                        color: "#2563EB",
                        fontSize: "11px",
                        marginBottom: "2px",
                      }}
                    >
                      re: {conv.job_title}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        color: conv.unread_count > 0 ? "#374151" : "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: conv.unread_count > 0 ? 500 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "160px",
                      }}
                    >
                      {conv.last_message?.content || "No messages yet"}
                    </p>
                    {conv.unread_count > 0 && (
                      <span
                        style={{
                          background: "#2563EB",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Chat window JSX
  const chatWindowJSX = (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #F3F4F6",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {!activeConv ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
          <p
            style={{
              color: "#111827",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            Select a conversation
          </p>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
            Choose a conversation from the left to start messaging
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #F3F4F6",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#FAFAFA",
            }}
          >
            <button
              onClick={() => setShowChat(false)}
              className="mobile-back-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6B7280",
                fontSize: "20px",
                padding: "0 4px 0 0",
                display: "none",
              }}
            >
              ←
            </button>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background:
                  activeConv.other_participant?.role === "employer"
                    ? "linear-gradient(135deg, #6D28D9, #8B5CF6)"
                    : "linear-gradient(135deg, #1E40AF, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {activeConv.other_participant?.full_name?.[0]?.toUpperCase() ||
                activeConv.other_participant?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p
                style={{ color: "#111827", fontWeight: 600, fontSize: "14px" }}
              >
                {activeConv.other_participant?.full_name ||
                  activeConv.other_participant?.email}
              </p>
              {activeConv.job_title && (
                <p style={{ color: "#2563EB", fontSize: "12px" }}>
                  re: {activeConv.job_title}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                No messages yet — say hello! 👋
              </div>
            )}
            {messages.map((msg) => {
              const isMine =
                msg.sender_id === user.id || msg.sender?.id === user.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      background: isMine ? "#111827" : "#F3F4F6",
                      color: isMine ? "#fff" : "#111827",
                      padding: "10px 14px",
                      borderRadius: isMine
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    <p>{msg.content}</p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: isMine ? "rgba(255,255,255,0.5)" : "#9CA3AF",
                        marginTop: "4px",
                        textAlign: "right",
                      }}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #F3F4F6",
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
              background: "#FAFAFA",
            }}
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              style={{
                flex: 1,
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
                resize: "none",
                lineHeight: 1.5,
                background: "#fff",
                maxHeight: "120px",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              style={{
                background: newMessage.trim() ? "#111827" : "#E5E7EB",
                color: newMessage.trim() ? "#fff" : "#9CA3AF",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                flexShrink: 0,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              Send →
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4" }}>
      <style>{STATIC_STYLES}</style>

      <div style={{ background: "#0F1923", padding: "24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1
            style={{
              color: "#F1F5F9",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Messages
            {totalUnread > 0 && (
              <span
                style={{
                  marginLeft: "10px",
                  background: "#2563EB",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "2px 10px",
                  borderRadius: "999px",
                }}
              >
                {totalUnread} new
              </span>
            )}
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div
        className="messages-container"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px",
          height: "calc(100vh - 180px)",
        }}
      >
        {/* Mobile view — show list or chat */}
        <div className="mobile-only" style={{ height: "100%" }}>
          {!showChat ? conversationListJSX : chatWindowJSX}
        </div>

        {/* Desktop view — side by side */}
        <div
          className="messages-desktop"
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "16px",
            height: "100%",
          }}
        >
          {conversationListJSX}
          {chatWindowJSX}
        </div>
      </div>
    </div>
  );
};

export default Messages;
