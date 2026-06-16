import { useEffect, useState } from "react";

const API_URL = "http://localhost:8099";

export default function SkillsRoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Нет токена. Войди через Keycloak заново.");
      throw new Error("Token not found");
    }

    return token;
  }

  async function request(url, options = {}) {
    const token = getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      alert("Сессия истекла. Войди заново.");
      throw new Error("Unauthorized");
    }

    return response;
  }

  async function loadRoadmap() {
    try {
      setLoading(true);
      setError("");

      const response = await request(
        `${API_URL}/skills/roadmap`
      );

      if (!response.ok) {
        throw new Error("Cannot load skills roadmap");
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white">
        Loading roadmap...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-8 shadow-2xl">
          <h1 className="text-5xl font-black">
            Skills Roadmap
          </h1>

          <p className="mt-3 text-indigo-100">
            Personal learning roadmap generated for your target position.
          </p>
        </div>

        {roadmap && (
          <>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">
                Target Position
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {roadmap.targetPosition}
              </h2>

              <p className="mt-3 text-slate-400">
                {roadmap.currentLevel} → {roadmap.desiredLevel}
              </p>
            </div>

            <div className="space-y-5">
              {roadmap.steps?.map((step) => (
                <div
                  key={step.orderNumber}
                  className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">
                      {step.orderNumber}. {step.title}
                    </h3>

                    {step.weakSkill && (
                      <span className="rounded-xl bg-red-500/20 px-3 py-2 text-sm font-bold text-red-300">
                        Weak Skill
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-slate-300">
                    {step.description}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm text-slate-400">
                      <span>Progress</span>
                      <span>{step.currentProgress}%</span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-700">
                      <div
                        className="h-3 rounded-full bg-indigo-500"
                        style={{
                          width: `${step.currentProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 font-bold text-indigo-300">
                      Tasks
                    </p>

                    <ul className="list-disc space-y-2 pl-5 text-slate-300">
                      {step.tasks?.map((task, index) => (
                        <li key={index}>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}