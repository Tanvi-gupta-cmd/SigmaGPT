import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import ChatWorkspace from "./components/ChatWorkspace";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("sigmagpt_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("sigmagpt_user");
        localStorage.removeItem("sigmagpt_token");
      }
    }

    setCheckingAuth(false);
  }, []);

  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("sigmagpt_token");
    localStorage.removeItem("sigmagpt_user");
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#07070b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xl">
            Σ
          </div>

          <p className="text-sm text-white/50">
            Loading SigmaGPT...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main className="min-h-screen bg-[#07070b] text-white">
      <header className="flex h-[68px] items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold">
            Σ
          </div>

          <div>
            <h1 className="text-sm font-semibold">
              Sigma<span className="text-violet-400">GPT</span>
            </h1>

            <p className="text-[11px] text-white/30">
              AI workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-white/80">
              {user.name}
            </p>

            <p className="text-[11px] text-white/30">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <ChatWorkspace user={user} />
    </main>
  );
}

export default App;