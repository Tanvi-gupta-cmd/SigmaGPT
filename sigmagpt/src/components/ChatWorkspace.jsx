import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiSettings,
  FiBookmark,
  FiCompass,
  FiMoreHorizontal,
  FiPaperclip,
  FiMic,
  FiSend,
} from "react-icons/fi";

const conversations = [
  {
    id: 1,
    title: "Write a professional email",
    time: "3m ago",
  },
  {
    id: 2,
    title: "Build a React dashboard",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Explain recursion simply",
    time: "2d ago",
  },
];

function ChatWorkspace({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

 const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("sigmagpt_token");
};

useEffect(() => {
  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load conversations"
        );
      }

      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Load conversations error:", error);
    }
  };

  loadConversations();
}, []);

const openConversation = async (conversationId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load conversation"
      );
    }

    setCurrentConversationId(conversationId);
    setMessages(data.messages || []);
  } catch (error) {
    console.error("Open conversation error:", error);
  }
};

const createNewConversation = async () => {
  try {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        title: "New chat",
        mode: "chat",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create conversation"
      );
    }

    const newConversation = data.conversation;

    // Add new conversation at top of sidebar
    setConversations((current) => [
      newConversation,
      ...current,
    ]);

    // Clear current messages
    setCurrentConversationId(newConversation._id);
    setMessages([]);

  } catch (error) {
    console.error("Create conversation error:", error);
  }
};

  const sendMessage = async () => {
  const text = message.trim();

  if (!text) return;

  const token = getToken();

  if (!token) {
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "assistant",
        content: "Please login again.",
      },
    ]);
    return;
  }

  try {
    let conversationId = currentConversationId;

    // Create conversation only if there isn't one already
    if (!conversationId) {
      const conversationResponse = await fetch(
        `${API_URL}/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: text.slice(0, 40),
            mode: "chat",
          }),
        }
      );

      const conversationData =
        await conversationResponse.json();

      if (!conversationResponse.ok) {
        throw new Error(
          conversationData.message ||
            "Failed to create conversation"
        );
      }

      conversationId =
        conversationData.conversation._id;

      setCurrentConversationId(conversationId);

      setConversations((current) => [
        conversationData.conversation,
        ...current,
      ]);
    }

    // Show user message
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        content: text,
      },
    ]);

    setMessage("");

    // Save user message
    const messageResponse = await fetch(
      `${API_URL}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          role: "user",
          content: text,
          mode: "chat",
        }),
      }
    );

    const messageData =
      await messageResponse.json();

    if (!messageResponse.ok) {
      throw new Error(
        messageData.message ||
          "Failed to save message"
      );
    }

    // Ask local AI
    const aiResponse = await fetch(
      `${API_URL}/ai/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          mode: "chat",
        }),
      }
    );

    const aiData = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(
        aiData.message || "Failed to generate AI response"
      );
    }

    const assistantText = aiData.reply;

    // Save assistant message
    await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversationId,
        role: "assistant",
        content: assistantText,
        mode: "chat",
      }),
    });

    // Show assistant response
    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantText,
      },
    ]);
  } catch (error) {
    console.error("Send message error:", error);

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "assistant",
        content:
          error.message ||
          "Something went wrong. Please try again.",
      },
    ]);
  }
};

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#07070b] text-white">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`${
          sidebarOpen ? "w-[260px]" : "w-0"
        } flex-shrink-0 overflow-hidden border-r border-white/[0.08] bg-[#0a0a10] transition-all duration-300`}
      >
        <div className="flex h-full w-[260px] flex-col">

          {/* Logo */}

          <div className="flex h-[68px] items-center justify-between border-b border-white/[0.08] px-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 font-semibold shadow-lg shadow-violet-950/30">
                Σ
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Sigma<span className="text-violet-400">GPT</span>
                </p>

                <p className="text-[10px] text-white/30">
                  AI workspace
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white"
            >
              <FiChevronLeft size={17} />
            </button>
          </div>

          {/* New chat */}

          <div className="p-3">
            <button
              onClick={createNewConversation}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-2.5 text-sm font-medium shadow-lg shadow-violet-950/20 transition hover:brightness-110"
            >
              <FiPlus size={16} />
              New chat
            </button>
          </div>

          {/* Search */}

          <div className="px-3">
            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                placeholder="Search conversations"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/25 focus:border-violet-500/30"
              />
            </div>
          </div>

          {/* Navigation */}

          <div className="grid grid-cols-3 gap-1.5 px-3 py-3">
            <button className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.07] py-2.5 text-[10px] text-white/45 transition hover:bg-white/[0.04] hover:text-white">
              <FiCompass size={15} />
              Explore
            </button>

            <button className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.07] py-2.5 text-[10px] text-white/45 transition hover:bg-white/[0.04] hover:text-white">
              <FiBookmark size={15} />
              Saved
            </button>

            <button className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.07] py-2.5 text-[10px] text-white/45 transition hover:bg-white/[0.04] hover:text-white">
              <FiSettings size={15} />
              Settings
            </button>
          </div>

          {/* Conversations */}

          <div className="thin-scroll flex-1 overflow-y-auto px-2">
            <p className="px-2 py-2 text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
              Today
            </p>

            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                   onClick={() => openConversation(conversation._id)}
                  className="group flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/[0.04]"
                >
                  <FiMessageSquare
                    size={14}
                    className="flex-shrink-0 text-white/25"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-white/65">
                      {conversation.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/25">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <FiMoreHorizontal
                    size={14}
                    className="text-white/20 opacity-0 transition group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* User */}

          <div className="border-t border-white/[0.08] p-3">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-violet-500 text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">
                  {user?.name}
                </p>

                <p className="truncate text-[10px] text-white/30">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="text-[10px] text-white/30 transition hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex min-w-0 flex-1 flex-col">

        {/* Top bar */}

        <header className="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-white/[0.08] px-4">

          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] text-white/45 transition hover:bg-white/5 hover:text-white"
              >
                <FiChevronRight size={17} />
              </button>
            )}

            <div>
              <p className="text-sm font-medium">
                New conversation
              </p>

              <p className="text-[10px] text-white/25">
                SigmaGPT · chat
              </p>
            </div>
          </div>

          <button className="grid h-8 w-8 place-items-center rounded-lg text-white/25 transition hover:bg-white/5 hover:text-white">
            <FiMoreHorizontal size={17} />
          </button>
        </header>

        {/* Messages */}

        <div className="thin-scroll flex-1 overflow-y-auto">

          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-5">
              <div className="max-w-xl text-center">

                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-semibold shadow-xl shadow-violet-950/30">
                  Σ
                </div>

                <h1 className="text-3xl font-semibold tracking-tight">
                  How can I help you today?
                </h1>

                <p className="mt-3 text-sm text-white/30">
                  Ask anything about coding, debugging, learning,
                  writing or building.
                </p>

                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  {[
                    "Build a React dashboard",
                    "Debug my JavaScript",
                    "Explain recursion simply",
                    "Write a professional email",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setMessage(suggestion)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-xs text-white/45 transition hover:border-violet-500/20 hover:bg-violet-500/[0.04] hover:text-white/70"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-5 py-8">

              {messages.map((item) => (
                <div
                  key={item._id || item.id}
                  className={`mb-7 flex gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.role === "assistant" && (
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xs">
                      Σ
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      item.role === "user"
                        ? "rounded-tr-md bg-violet-500/15 text-white/80"
                        : "rounded-tl-md border border-white/[0.08] bg-white/[0.025] text-white/65"
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Composer */}

        <div className="flex-shrink-0 border-t border-white/[0.08] px-4 py-4">

          <div className="mx-auto max-w-3xl">

            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.025] shadow-2xl shadow-black/20">

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Message SigmaGPT in chat mode..."
                className="w-full resize-none bg-transparent px-4 pt-4 text-sm text-white outline-none placeholder:text-white/25"
              />

              <div className="flex items-center justify-between px-3 pb-3 pt-2">

                <div className="flex items-center gap-1">
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white">
                    <FiPaperclip size={16} />
                  </button>

                  <button className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white">
                    <FiMic size={16} />
                  </button>

                  <span className="ml-2 hidden text-[10px] text-white/20 sm:block">
                    Enter to send · Shift + Enter for new line
                  </span>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <FiSend size={15} />
                </button>

              </div>
            </div>

            <p className="mt-2 text-center text-[9px] text-white/15">
              SigmaGPT can make mistakes. Check important information.
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatWorkspace;