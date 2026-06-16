import keycloak from "../keycloak";

export default function LoginPage({ setPage }) {
  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin,
    });
  };

  const handleRegister = () => {
    setPage("register");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-slate-400">
          Login with Keycloak
        </p>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-indigo-500 px-5 py-3 font-medium text-white"
          >
            Login with Keycloak
          </button>

          <button
            onClick={handleRegister}
            className="w-full rounded-2xl bg-slate-800 px-5 py-3 font-medium text-slate-100"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}