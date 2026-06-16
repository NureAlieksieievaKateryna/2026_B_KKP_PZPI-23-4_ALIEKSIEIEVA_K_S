import { useState } from "react";

const API_URL = "http://localhost:8099";

export default function MockInterviewPage() {
  const [targetPosition, setTargetPosition] = useState("JAVA_DEVELOPER");
  const [level, setLevel] = useState("JUNIOR");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

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

  async function generateQuestion() {
    setLoading(true);
    setFeedback("");
    setCorrectAnswer("");
    setScore(null);
    setAnswer("");

    try {
      const response = await request(`${API_URL}/mock-interview/ask`, {
        method: "POST",
        body: JSON.stringify({
          targetPosition,
          level,
        }),
      });

      if (!response.ok) {
        alert("Ошибка генерации вопроса");
        return;
      }

      const data = await response.json();
      setQuestion(data.question);
      setCorrectAnswer(data.correctAnswer);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer() {
    if (!question.trim()) {
      alert("Сначала сгенерируй вопрос");
      return;
    }

    if (!answer.trim()) {
      alert("Напиши ответ");
      return;
    }

    setLoading(true);

    try {
      const response = await request(`${API_URL}/mock-interview/evaluate`, {
        method: "POST",
        body: JSON.stringify({
          targetPosition,
          level,
          question,
          answer,
        }),
      });

      if (!response.ok) {
        alert("Ошибка проверки ответа");
        return;
      }

      const data = await response.json();

      setFeedback(data.feedback);
      setScore(data.score);
      setCorrectAnswer(data.correctAnswer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-8 shadow-2xl">
          <h1 className="text-5xl font-black">Mock Interview</h1>
          <p className="mt-3 text-indigo-100">
            Тренировка собеседования с AI: получи вопрос, напиши ответ и получи оценку.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h2 className="text-2xl font-black">Interview Settings</h2>

            <div>
              <label className="text-sm text-slate-400">Target position</label>
              <select
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              >
                <option value="JAVA_DEVELOPER">Java Developer</option>
                <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
                <option value="BACKEND_DEVELOPER">Backend Developer</option>
                <option value="FULLSTACK_DEVELOPER">Fullstack Developer</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              >
                <option value="INTERN">Intern</option>
                <option value="JUNIOR">Junior</option>
                <option value="MIDDLE">Middle</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <button
              onClick={generateQuestion}
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-500 px-5 py-4 font-bold transition hover:bg-indigo-400 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Generate Question"}
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h2 className="text-2xl font-black">Question</h2>

            <div className="min-h-[160px] rounded-2xl bg-slate-950 p-5 text-slate-300">
              {question || "Question will appear here..."}
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="h-40 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
            />

            <button
              onClick={evaluateAnswer}
              disabled={loading}
              className="w-full rounded-2xl bg-violet-500 px-5 py-4 font-bold transition hover:bg-violet-400 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Evaluate Answer"}
            </button>
          </div>
        </div>

        {(feedback || score !== null || correctAnswer) && (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 space-y-5">
            <h2 className="text-2xl font-black">Result</h2>

            {score !== null && (
              <div>
                <p className="text-slate-400">Score</p>
                <p className="text-4xl font-black text-indigo-300">
                  {score}/100
                </p>

                <div className="mt-3 h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-indigo-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )}

            {feedback && (
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="mb-2 font-bold text-indigo-300">Feedback</p>
                <p className="whitespace-pre-wrap text-slate-300">
                  {feedback}
                </p>
              </div>
            )}

            {correctAnswer && (
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="mb-2 font-bold text-violet-300">
                  Correct answer example
                </p>
                <p className="whitespace-pre-wrap text-slate-300">
                  {correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}