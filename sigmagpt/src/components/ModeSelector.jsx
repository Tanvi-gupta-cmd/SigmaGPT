import {
  FiMessageSquare,
  FiCode,
  FiAlertCircle,
  FiBookOpen,
  FiZap,
  FiEdit3,
} from "react-icons/fi";

const modes = [
  {
    id: "chat",
    label: "Chat",
    icon: FiMessageSquare,
  },
  {
    id: "code",
    label: "Code",
    icon: FiCode,
  },
  {
    id: "debug",
    label: "Debug",
    icon: FiAlertCircle,
  },
  {
    id: "explain",
    label: "Explain",
    icon: FiBookOpen,
  },
  {
    id: "optimize",
    label: "Optimize",
    icon: FiZap,
  },
  {
    id: "write",
    label: "Write",
    icon: FiEdit3,
  },
];

function ModeSelector({ activeMode, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={`group flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-all duration-200 ${
              active
                ? "border-violet-400/40 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/20"
                : "border-white/10 bg-white/[0.025] text-white/40 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/80"
            }`}
          >
            <Icon
              size={14}
              className="transition-transform duration-200 group-hover:scale-110"
            />

            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

export default ModeSelector;