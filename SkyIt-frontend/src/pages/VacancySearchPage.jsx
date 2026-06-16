import { useEffect, useState } from "react";

export default function VacancySearchPage() {
  const [query, setQuery] = useState("java");
  const [location, setLocation] = useState("kyiv");
  const [employmentType, setEmploymentType] = useState("");
  const [vacancies, setVacancies] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadVacancies() {
    setLoading(true);

    const response = await fetch("http://localhost:8080/api/vacancies");
    const data = await response.json();

    setVacancies(data);
    setLoading(false);
  }

  async function loadNewCount() {
    const response = await fetch("http://localhost:8080/api/vacancies/new-count");
    const data = await response.json();

    setNewCount(data.count);
  }

  async function savePreference() {
    await fetch("http://localhost:8080/api/vacancies/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        location,
        employmentType,
      }),
    });

    await loadVacancies();
    await loadNewCount();
  }

  useEffect(() => {
    loadVacancies();
    loadNewCount();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Vacancy Search
          </h1>

          <p className="mt-2 text-slate-400">
            Вакансії, які автоматично парсяться з Work.ua
          </p>
        </div>

        {newCount > 0 && (
          <div className="rounded-full bg-emerald-500 px-5 py-3 font-bold text-white">
            +{newCount} нові вакансії
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Наприклад: java"
            className="rounded-2xl bg-slate-800 p-4 text-white outline-none md:col-span-2"
          />

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-2xl bg-slate-800 p-4 text-white outline-none"
          >
            <option value="">Вся Україна</option>
            <option value="kyiv">Київ</option>
            <option value="remote">Дистанційно</option>
            <option value="odesa">Одеса</option>
            <option value="lviv">Львів</option>
            <option value="kharkiv">Харків</option>
            <option value="dnipro">Дніпро</option>
          </select>

          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="rounded-2xl bg-slate-800 p-4 text-white outline-none"
          >
            <option value="">Тип роботи</option>
            <option value="Повна зайнятість">Повна зайнятість</option>
            <option value="Неповна зайнятість">Неповна зайнятість</option>
            <option value="Дистанційно">Дистанційно</option>
            <option value="Стажування">Стажування</option>
          </select>
        </div>

        <button
          onClick={savePreference}
          className="mt-5 rounded-2xl bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-700"
        >
          Зберегти пошук
        </button>
      </div>

      {loading && (
        <p className="text-slate-400">Завантаження вакансій...</p>
      )}

      <div className="grid gap-6">
        {vacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            className="relative rounded-3xl bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            {vacancy.isNew && (
              <span className="absolute right-6 top-6 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                Нова
              </span>
            )}

            <h2 className="pr-24 text-3xl font-bold text-slate-900">
              {vacancy.title}
            </h2>

            {vacancy.salary && (
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {vacancy.salary}
              </p>
            )}

            <p className="mt-3 text-xl font-semibold">
              {vacancy.company}
            </p>

            <p className="mt-1 text-slate-500">
              {vacancy.location}
            </p>

            <p className="mt-5 line-clamp-3 text-lg text-slate-600">
              {vacancy.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <button className="rounded-full border border-slate-300 px-5 py-2 font-semibold hover:bg-slate-100">
                Зберегти ♡
              </button>

              <a
                href={vacancy.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Відкрити
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}