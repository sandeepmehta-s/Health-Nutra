/**
 * Health Nutra - LoginPage View
 * Admin authentication page styled with Tailwind CSS.
 */

function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Check if already authenticated
    if (window.apiHelper) {
      window.apiHelper.checkAdminAuth().then((data) => {
        if (data && data.success && data.admin) {
          window.location.href = "/admin";
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await window.apiHelper.loginAdmin(username.trim(), password);
      if (res && res.success) {
        window.location.href = "/admin";
      } else {
        setErrorMsg(res?.message || "Invalid credentials. Please verify your credentials.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-slate-900 to-brand-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans text-slate-800">
      
      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <a href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
            <Icon name="leaf" className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white tracking-tight leading-none">
              HEALTH <span className="text-accent-500">NUTRA</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pharmaceutical Admin</span>
          </div>
        </a>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-2">
          Admin Portal Authentication
        </h2>
        <p className="text-xs text-slate-400">
          Sign in to manage formulations, inventory, and orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Icon name="user" className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Icon name="lock" className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-lg shadow-brand-800/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Icon name="log-in" className="w-4 h-4" />
                  <span>Sign In to Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs font-bold text-slate-500 hover:text-brand-700 transition-colors inline-flex items-center gap-1.5">
              <Icon name="arrow-left" className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.LoginPage = LoginPage;
}

if (typeof exports !== "undefined") {
  exports.LoginPage = LoginPage;
}

