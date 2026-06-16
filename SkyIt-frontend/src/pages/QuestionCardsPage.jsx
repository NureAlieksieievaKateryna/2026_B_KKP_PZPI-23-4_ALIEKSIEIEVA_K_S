import { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ListChecks,
  Plus,
} from "lucide-react";

const API_URL = "http://localhost:8099";

export default function QuestionCardsPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [openedId, setOpenedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    level: "JUNIOR",
  });

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

  async function loadTopics() {
    const response = await request(`${API_URL}/topics`);

    if (!response.ok) {
      alert("Ошибка загрузки тем");
      return;
    }

    const data = await response.json();
    setTopics(data);

    if (data.length > 0 && !selectedTopicId) {
      setSelectedTopicId(data[0].id);
    }
  }

  async function createTopic() {
    if (!newTopic.name.trim()) {
      alert("Введите название темы");
      return;
    }

    const response = await request(`${API_URL}/topics`, {
      method: "POST",
      body: JSON.stringify(newTopic),
    });

    if (!response.ok) {
      alert("Ошибка создания темы");
      return;
    }

    const created = await response.json();

    setTopics([...topics, created]);
    setSelectedTopicId(created.id);

    setNewTopic({
      name: "",
      description: "",
      level: "JUNIOR",
    });
  }

  async function loadQuestionsByTopic(topicId = selectedTopicId) {
    if (!topicId) return;

    const response = await request(`${API_URL}/question/topic/${topicId}`);

    if (!response.ok) {
      alert("Ошибка загрузки вопросов");
      return;
    }

    const data = await response.json();
    setQuestions(data);
  }

  async function generateQuestions() {
    if (!selectedTopicId) {
      alert("Сначала выбери тему");
      return;
    }

    setLoading(true);

    try {
      const response = await request(
        `${API_URL}/question/generate/topic/${selectedTopicId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        alert("Ошибка генерации вопросов");
        return;
      }

      const data = await response.json();
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  }

  async function saveQuestion(questionId) {
    const response = await request(`${API_URL}/question/repeat/${questionId}`, {
      method: "POST",
    });

    if (!response.ok) {
      alert("Ошибка сохранения вопроса");
      return;
    }

    alert("Вопрос сохранён для повторения");
  }

  async function loadSavedQuestions() {
    const response = await request(`${API_URL}/question/repeat`);

    if (!response.ok) {
      alert("Ошибка загрузки сохранённых вопросов");
      return;
    }

    const data = await response.json();
    setQuestions(data);
  }

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopicId) {
      loadQuestionsByTopic(selectedTopicId);
    }
  }, [selectedTopicId]);

  const selectedTopic = topics.find(
    (topic) => String(topic.id) === String(selectedTopicId)
  );

return (
  <div className="min-h-screen overflow-x-hidden bg-slate-950 p-3 text-white sm:p-4 lg:p-6">
    <div className="mx-auto w-full max-w-[1800px] space-y-6 lg:space-y-8">

      <div className="overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-5 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-center 2xl:justify-between">

          <div className="min-w-0">
            <h1 className="break-words text-3xl font-black sm:text-4xl xl:text-5xl">
              Question Cards
            </h1>

            <p className="mt-3 max-w-3xl break-words text-sm text-indigo-100 sm:text-base">
              Выбери тему, сгенерируй AI вопросы и сохрани сложные для повторения.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateQuestions}
              disabled={loading}
              className="flex min-h-[56px] items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-4 font-bold transition hover:bg-indigo-400 disabled:opacity-50"
            >
              <Sparkles size={20} />
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={loadSavedQuestions}
              className="flex min-h-[56px] items-center gap-2 rounded-2xl bg-violet-500 px-5 py-4 font-bold transition hover:bg-violet-400"
            >
              <ListChecks size={20} />
              Saved
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[380px_minmax(0,1fr)]">

        <div className="min-w-0 space-y-6">

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h2 className="text-2xl font-black">Choose topic</h2>

            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="mt-5 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
            >
              {topics.length === 0 && (
                <option value="">No topics yet</option>
              )}

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name} — {topic.level}
                </option>
              ))}
            </select>

            {selectedTopic && (
              <div className="mt-5 overflow-hidden rounded-2xl bg-slate-950 p-4">
                <p className="break-words font-bold text-indigo-300">
                  {selectedTopic.name}
                </p>

                <p className="mt-2 break-words text-sm text-slate-400">
                  {selectedTopic.description}
                </p>

                <span className="mt-3 inline-flex max-w-full break-words rounded-xl bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                  {selectedTopic.level}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h2 className="text-2xl font-black">Create topic</h2>

            <div className="mt-5 space-y-4">

              <input
                value={newTopic.name}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, name: e.target.value })
                }
                placeholder="Spring Boot / Python / Docker"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              />

              <textarea
                value={newTopic.description}
                onChange={(e) =>
                  setNewTopic({
                    ...newTopic,
                    description: e.target.value,
                  })
                }
                placeholder="Describe this topic..."
                className="h-28 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              />

              <select
                value={newTopic.level}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, level: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              >
                <option value="JUNIOR">Junior</option>
                <option value="MIDDLE">Middle</option>
                <option value="SENIOR">Senior</option>
              </select>

              <button
                onClick={createTopic}
                className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-4 font-bold transition hover:bg-indigo-400"
              >
                <Plus size={20} />
                Create topic
              </button>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-5 overflow-hidden">

          {questions.length === 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              No questions yet. Choose topic and click Generate.
            </div>
          )}

          {questions.map((item) => {
            const opened = openedId === item.id;

            return (
              <div
                key={item.id}
                className="w-full overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-4 transition hover:border-indigo-500 sm:p-6"
              >

                <div className="flex min-w-0 flex-col gap-5 sm:flex-row">

                  <div className="shrink-0 self-start rounded-2xl bg-indigo-500/20 p-4">
                    <Brain className="text-indigo-300" />
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">

                    <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:justify-between">

                      <div className="min-w-0 flex-1 overflow-hidden">

                        <p className="break-words text-lg font-black leading-7 sm:text-xl">
                          {item.question}
                        </p>

                        <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-7 text-slate-400 sm:text-base">
                          {item.shortAnswer}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {item.difficulty && (
                            <span className="max-w-full break-words rounded-xl bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                              {item.difficulty}
                            </span>
                          )}

                          {item.topicName && (
                            <span className="max-w-full break-words rounded-xl bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                              {item.topicName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2 self-start">

                        <button
                          onClick={() => saveQuestion(item.id)}
                          className="rounded-xl bg-violet-500 p-3 transition hover:bg-violet-400"
                          title="Save for repeat"
                        >
                          <Bookmark size={20} />
                        </button>

                        <button
                          onClick={() =>
                            setOpenedId(opened ? null : item.id)
                          }
                          className="rounded-xl bg-slate-800 p-3 transition hover:bg-indigo-500"
                        >
                          {opened ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                    </div>

                    {opened && (
                      <div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5">

                        <p className="mb-2 text-sm font-bold text-indigo-300">
                          Full answer
                        </p>

                        <p className="overflow-hidden whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 sm:text-base">
                          {item.fullAnswer || "No full answer"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
}