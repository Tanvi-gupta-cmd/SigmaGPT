import {
  FiArrowDown,
  FiCopy,
  FiMoreHorizontal,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

function ChatArea({ messages = [] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Chat header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
        <div>
          <p className="text-xs font-medium text-white/75">
            SigmaGPT
          </p>
          <p className="text-[10px] text-white/25">
            AI workspace
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
        >
          <FiMoreHorizontal size={17} />
        </button>
      </div>

      {/* Messages */}
      <div className="thin-scroll flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex min-h-full items-center justify-center px-5 py-12">
            <div className="max-w-md text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-semibold text-white shadow-xl shadow-violet-950/30">
                Σ
              </div>

              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                Start a conversation
              </h2>

              <p className="mt-2 text-xs leading-6 text-white/35">
                Ask a question, paste some code, or describe something
                you want to build.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-7 px-5 py-8">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      {/* Scroll to bottom */}
      {messages.length > 4 && (
        <button
          type="button"
          className="absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#12121b] p-2 text-white/50 shadow-xl transition hover:text-white"
        >
          <FiArrowDown size={14} />
        </button>
      )}
    </div>
  );
}

function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-semibold text-white">
          Σ
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          isUser
            ? "rounded-2xl rounded-tr-md bg-violet-500/15 px-4 py-3"
            : "min-w-0 flex-1"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/35">
            {isUser ? "You" : "SigmaGPT"}
          </span>

          {isUser && (
            <FiUser size={10} className="text-white/20" />
          )}
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-white/75">
          {message.content}
        </p>

        {!isUser && (
          <div className="mt-3 flex items-center gap-1">
            <button
              type="button"
              title="Copy"
              className="rounded-lg p-1.5 text-white/20 transition hover:bg-white/5 hover:text-white/60"
            >
              <FiCopy size={13} />
            </button>

            <button
              type="button"
              title="Regenerate"
              className="rounded-lg p-1.5 text-white/20 transition hover:bg-white/5 hover:text-white/60"
            >
              <FiRefreshCw size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatArea;