import { useRef, useState } from "react";
import {
  FiArrowUp,
  FiMic,
  FiPaperclip,
  FiSquare,
  FiX,
} from "react-icons/fi";

function Composer({ mode = "chat", onSend, loading = false }) {
  const [value, setValue] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const submit = () => {
    const text = value.trim();

    if (!text || loading) return;

    onSend?.({
      content: text,
      file: attachedFile,
      mode,
    });

    setValue("");
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setAttachedFile(file);
  };

  return (
    <div className="border-t border-white/10 bg-[#07070b]/80 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-3xl">
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
            <FiPaperclip size={13} className="text-violet-400" />

            <span className="min-w-0 flex-1 truncate text-xs text-white/55">
              {attachedFile.name}
            </span>

            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="rounded-md p-1 text-white/30 transition hover:bg-white/5 hover:text-white"
            >
              <FiX size={13} />
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#101018]/95 shadow-2xl shadow-black/30 transition focus-within:border-violet-500/30 focus-within:shadow-violet-950/10">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={3}
            placeholder={`Message SigmaGPT in ${mode} mode...`}
            className="block w-full resize-none bg-transparent px-4 pt-3.5 text-sm leading-6 text-white outline-none placeholder:text-white/25 disabled:opacity-50"
          />

          <div className="flex items-center justify-between px-3 pb-2.5 pt-2">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFile}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                title="Attach file"
              >
                <FiPaperclip size={16} />
              </button>

              <button
                type="button"
                className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                title="Voice input"
              >
                <FiMic size={16} />
              </button>

              <span className="ml-1 hidden text-[10px] text-white/20 sm:block">
                Enter to send · Shift + Enter for new line
              </span>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!value.trim() && !loading}
              className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${
                loading
                  ? "bg-white/10 text-white/50"
                  : value.trim()
                    ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-950/30 hover:scale-105 hover:brightness-110"
                    : "bg-white/5 text-white/20"
              }`}
              title={loading ? "Stop generating" : "Send message"}
            >
              {loading ? <FiSquare size={13} /> : <FiArrowUp size={16} />}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-white/20">
          SigmaGPT may make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}

export default Composer;