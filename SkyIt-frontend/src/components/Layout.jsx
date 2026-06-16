import keycloak from "../keycloak";
import {
  BarChart3,
  Briefcase,
  Layers,
  BookOpen,
  Brain,
  FileText,
  LogOut,
  Home,
  User,
} from "lucide-react";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "vacancies", label: "Vacancies", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "questions", label: "Questions", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
  { id: "mock", label: "Mock Interview", icon: Brain },
  { id: "resume", label: "Resume Review", icon: FileText },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

export default function Layout({ page, setPage, children }) {
  const logout = () => {
    localStorage.removeItem("token");
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-800 bg-slate-900 p-5 lg:block">
        <div className="mb-8 rounded-3xl bg-indigo-500 p-5">
          <h1 className="text-2xl font-bold">SkyIT</h1>
          <p className="text-sm text-indigo-100">Interview preparation</p>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  page === item.id
                    ? "bg-indigo-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="lg:ml-72">
        <div className="border-b border-slate-800 bg-slate-900 p-4 lg:hidden">
          <select
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="w-full rounded-2xl bg-slate-800 p-3 text-white"
          >
            {menu.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}