import keycloak from "../keycloak";

export default function DashboardPage({ setPage }) {

  const logout = () => {
    localStorage.removeItem("token");

    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome to SkyIT
          </h1>

          <p className="mt-3 text-slate-400">
            AI platform for interview preparation and career growth
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white"
        >
          Logout
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <button
          onClick={() => setPage("vacancies")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Vacancies
          </h2>

          <p className="mt-3 text-slate-400">
            Search IT вакансии и анализируй требования
          </p>
        </button>

        <button
          onClick={() => setPage("skills")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Skills Roadmap
          </h2>

          <p className="mt-3 text-slate-400">
            Построй roadmap развития навыков
          </p>
        </button>

        <button
          onClick={() => setPage("questions")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Question Cards
          </h2>

          <p className="mt-3 text-slate-400">
            Подготовка к technical interview
          </p>
        </button>

        <button
          onClick={() => setPage("mock")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Mock Interview
          </h2>

          <p className="mt-3 text-slate-400">
            AI mock interview simulation
          </p>
        </button>

        <button
          onClick={() => setPage("resume")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Resume Review
          </h2>

          <p className="mt-3 text-slate-400">
            Анализ и улучшение CV
          </p>
        </button>

        <button
          onClick={() => setPage("progress")}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-white">
            Progress
          </h2>

          <p className="mt-3 text-slate-400">
            Следи за своим прогрессом
          </p>
        </button>

      </div>

    </div>
  );
}