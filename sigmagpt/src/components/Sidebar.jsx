import {
  FiChevronLeft,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiSettings,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const conversations = [
  {
    id: 1,
    title: "Build React dashboard",
    pinned: true,
  },
  {
    id: 2,
    title: "Explain closures",
    pinned: false,
  },
  {
    id: 3,
    title: "Fix authentication bug",
    pinned: false,
  },
  {
    id: 4,
    title: "Portfolio improvements",
    pinned: false,
  },
];

function Sidebar({ open, onClose, onNewChat }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[270px] border-r border-white/10 bg-[#0b0b11]/95 backdrop-blur-2xl transition-transform duration-300 lg:relative lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col p-3">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-violet-950/30">
                Σ
              </div>

              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Sigma<span className="text-violet-400">GPT</span>
                </h1>

                <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                  AI workspace
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/35 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <FiX size={17} />
          </button>
        </div>

        {/* New Chat */}
        <button
          type="button"
          onClick={onNewChat}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
        >
          <FiPlus size={15} />
          New chat
        </button>

        {/* Search */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
          <FiSearch size={14} className="shrink-0 text-white/30" />

          <input
            type="text"
            placeholder="Search conversations..."
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
          />

          <kbd className="hidden rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] text-white/20 sm:block">
            ⌘ K
          </kbd>
        </div>

        {/* Conversations */}
        <div className="thin-scroll mt-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Recent
            </p>

            <button
              type="button"
              className="text-white/20 transition hover:text-white/60"
              title="Clear conversations"
            >
              <FiTrash2 size={12} />
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {conversations.map((conversation) => (
              <button
  key={conversation._id}
  onClick={() => openConversation(conversation._id)}
                type="button"
                className="group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.05]"
              >
                <FiMessageSquare
                  size={13}
                  className="shrink-0 text-white/20 group-hover:text-violet-400"
                />

                <span className="min-w-0 flex-1 truncate text-xs text-white/50 group-hover:text-white/80">
                  {conversation.title}
                </span>

                {conversation.pinned && (
                  <span className="text-[10px] text-violet-400">📌</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <FiSettings size={15} />
            Settings
          </button>

          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.025] p-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-semibold">
              T
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/75">
                Tanvi
              </p>
              <p className="text-[10px] text-white/25">Free workspace</p>
            </div>

            <FiChevronLeft className="ml-auto rotate-180 text-white/20" size={14} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;