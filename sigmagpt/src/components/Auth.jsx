import { useState } from "react";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import { loginUser, signupUser } from "../api";

function Auth({ onAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = isLogin
        ? await loginUser(email, password)
        : await signupUser(name, email, password);

      localStorage.setItem("sigmagpt_token", data.token);
      localStorage.setItem("sigmagpt_user", JSON.stringify(data.user));

      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07070b] px-4 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-semibold shadow-xl shadow-violet-950/30">
            Σ
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>

          <p className="mt-2 text-sm text-white/35">
            {isLogin
              ? "Sign in to continue to your SigmaGPT workspace."
              : "Create your account and start building with SigmaGPT."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
        >
          {!isLogin && (
            <label className="mb-4 block">
              <span className="mb-2 block text-xs text-white/50">
                Full name
              </span>

              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-500/40"
                />
              </div>
            </label>
          )}

          <label className="mb-4 block">
            <span className="mb-2 block text-xs text-white/50">
              Email
            </span>

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-xs text-white/50">
              Password
            </span>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>
          </label>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign in"
                : "Create account"}

            {!loading && <FiArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/30">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin((value) => !value);
              setError("");
            }}
            className="ml-1 text-violet-400 transition hover:text-violet-300"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default Auth;