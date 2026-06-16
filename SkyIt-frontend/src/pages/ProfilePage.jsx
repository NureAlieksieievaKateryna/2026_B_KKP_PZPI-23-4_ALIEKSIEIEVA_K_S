import { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Building2,
  Link,
  Save,
  Code2,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:8099";

const SKILLS = [
  { id: 1, name: "Java" },
  { id: 2, name: "Spring Boot" },
  { id: 3, name: "Spring Security" },
  { id: 4, name: "PostgreSQL" },
  { id: 5, name: "React" },
  { id: 6, name: "Docker" },
  { id: 7, name: "Kafka" },
  { id: 8, name: "Redis" },
  { id: 9, name: "MinIO" },
  { id: 10, name: "Azure" },
];

const LEVELS = [
  "INTERN",
  "JUNIOR",
  "STRONG_JUNIOR",
  "MIDDLE",
  "STRONG_MIDDLE",
  "SENIOR",
  "TECH_LEAD",
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    targetPosition: "JAVA_DEVELOPER",
    currentLevel: "JUNIOR",
    desiredLevel: "MIDDLE",
    country: "UKRAINE",
    officeType: "REMOTE",
    bio: "",
    helpfulLinksUrl: [],
    skills: [],
  });

  const [newLink, setNewLink] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(false);

  function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Нет токена. Войди через Keycloak заново.");
      throw new Error("Token not found");
    }

    return token;
  }

  async function loadProfile() {
    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) return;

      if (response.status === 401) {
        alert("Сессия истекла. Войди заново.");
        return;
      }

      if (!response.ok) {
        alert("Ошибка загрузки профиля");
        return;
      }

      const data = await response.json();

      setForm({
        fullName: data.fullName || "",
        targetPosition: data.targetPosition || "JAVA_DEVELOPER",
        currentLevel: data.currentLevel || "JUNIOR",
        desiredLevel: data.desiredLevel || "MIDDLE",
        country: data.country || "UKRAINE",
        officeType: data.officeType || "REMOTE",
        bio: data.bio || "",
        helpfulLinksUrl: data.helpfulLinksUrl || [],
        skills: data.skills || [],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfile() {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/user/update/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        alert("Сессия истекла. Войди заново.");
        return;
      }

      if (!response.ok) {
        alert("Ошибка сохранения профиля");
        return;
      }

      alert("Профиль сохранён");
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    setForm({
      ...form,
      skills: [
        ...form.skills,
        {
          skillId: 1,
          level: "JUNIOR",
          progress: 0,
          isWeak: false,
        },
      ],
    });
  };

  const updateSkill = (index, field, value) => {
    setForm({
      ...form,
      skills: form.skills.map((skill, i) =>
        i === index
          ? {
              ...skill,
              [field]:
                field === "skillId" || field === "progress"
                  ? Number(value)
                  : value,
            }
          : skill
      ),
    });
  };

  const deleteSkill = (index) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  };

  const addLink = () => {
    if (!newLink.trim()) return;

    setForm({
      ...form,
      helpfulLinksUrl: [...form.helpfulLinksUrl, newLink.trim()],
    });

    setNewLink("");
  };

  const deleteLink = (index) => {
    setForm({
      ...form,
      helpfulLinksUrl: form.helpfulLinksUrl.filter((_, i) => i !== index),
    });
  };

  const startEditLink = (index) => {
    setEditingIndex(index);
    setEditingValue(form.helpfulLinksUrl[index]);
  };

  const saveEditLink = () => {
    if (!editingValue.trim()) return;

    setForm({
      ...form,
      helpfulLinksUrl: form.helpfulLinksUrl.map((item, index) =>
        index === editingIndex ? editingValue.trim() : item
      ),
    });

    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#050816] to-[#0f172a]">
      <div className="mx-auto w-full max-w-[1500px] space-y-8 p-4 sm:p-6 xl:p-10">
        <div className="overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-indigo-950 p-6 shadow-2xl sm:p-8">
          <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-white/10 sm:h-24 sm:w-24">
              <User size={42} className="text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-4xl font-black text-white sm:text-5xl">
                User Profile
              </h1>
              <p className="mt-3 break-words text-base text-indigo-100 sm:text-lg">
                Complete your profile to get personalized interview questions, job recommendations, and a learning roadmap.
              </p>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-8">
            <h2 className="mb-8 break-words text-3xl font-bold text-white">
              Main information
            </h2>

            <div className="grid min-w-0 gap-5 md:grid-cols-2">
              <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} />

              <Select label="Target position" name="targetPosition" value={form.targetPosition} onChange={handleChange}>
                <option value="JAVA_DEVELOPER">Java Developer</option>
                <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
                <option value="BACKEND_DEVELOPER">Backend Developer</option>
                <option value="FULLSTACK_DEVELOPER">Fullstack Developer</option>
                <option value="DEVOPS_ENGINEER">DevOps Engineer</option>
                <option value="QA_ENGINEER">QA Engineer</option>
                <option value="UI_UX_DESIGNER">UI/UX Designer</option>
                <option value="MOBILE_DEVELOPER">Mobile Developer</option>
              </Select>

              <Select label="Current level" name="currentLevel" value={form.currentLevel} onChange={handleChange}>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>

              <Select label="Desired level" name="desiredLevel" value={form.desiredLevel} onChange={handleChange}>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>

              <Select label="Country" name="country" value={form.country} onChange={handleChange}>
                <option value="UKRAINE">Ukraine</option>
                <option value="POLAND">Poland</option>
                <option value="NORWAY">Norway</option>
                <option value="USA">USA</option>
                <option value="FRANCE">France</option>
                <option value="SPAIN">Spain</option>
                <option value="GERMANY">Germany</option>
              </Select>

              <Select label="Office type" name="officeType" value={form.officeType} onChange={handleChange}>
                <option value="REMOTE">Remote</option>
                <option value="OFFICE">Office</option>
                <option value="HIBRID">Hybrid</option>
              </Select>
            </div>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/30 p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-bold text-white">
                    Skills
                  </h2>
                  <p className="mt-1 break-words text-sm text-slate-400">
                    Добавь технологии, уровень и прогресс.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSkill}
                  className="w-full rounded-2xl bg-indigo-500 px-5 py-4 font-semibold text-white sm:w-auto"
                >
                  Add skill
                </button>
              </div>

              <div className="space-y-4">
                {form.skills.length === 0 && (
                  <p className="rounded-2xl bg-slate-900/70 p-5 text-sm text-slate-400">
                    Навыки пока не добавлены.
                  </p>
                )}

                {form.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="space-y-4">
                      <Select
                        label="Skill"
                        name={`skill-${index}`}
                        value={skill.skillId}
                        onChange={(e) =>
                          updateSkill(index, "skillId", e.target.value)
                        }
                      >
                        {SKILLS.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Select>

                      <Select
                        label="Level"
                        name={`skill-level-${index}`}
                        value={skill.level || "JUNIOR"}
                        onChange={(e) =>
                          updateSkill(index, "level", e.target.value)
                        }
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level.replaceAll("_", " ")}
                          </option>
                        ))}
                      </Select>

                      <Input
                        label="Progress %"
                        name={`progress-${index}`}
                        type="number"
                        value={skill.progress ?? 0}
                        onChange={(e) =>
                          updateSkill(index, "progress", e.target.value)
                        }
                      />

                      <label className="flex items-center gap-3 rounded-2xl bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={Boolean(skill.isWeak)}
                          onChange={(e) =>
                            updateSkill(index, "isWeak", e.target.checked)
                          }
                          className="h-5 w-5"
                        />
                        Weak skill
                      </label>

                      <button
                        type="button"
                        onClick={() => deleteSkill(index)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/80 px-5 py-3 font-semibold text-white hover:bg-red-500"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-400">
                Bio
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell about yourself."
                className="h-40 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-white outline-none"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-5 text-lg font-bold text-white disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 sm:p-6">
              <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
                Profile summary
              </h2>

              <div className="mt-6 space-y-4">
                <Summary icon={<Briefcase />} label="Position" value={form.targetPosition} />
                <Summary icon={<MapPin />} label="Country" value={form.country} />
                <Summary icon={<Building2 />} label="Work format" value={form.officeType} />
                <Summary icon={<User />} label="Level" value={`${form.currentLevel} → ${form.desiredLevel}`} />
                <Summary icon={<Code2 />} label="Skills" value={`${form.skills.length} selected`} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 sm:p-6">
              <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
                Helpful links
              </h2>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="GitHub / LinkedIn"
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-white outline-none"
                />

                <button
                  onClick={addLink}
                  className="rounded-2xl bg-indigo-500 px-6 py-4 font-semibold text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {form.helpfulLinksUrl.map((item, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl bg-slate-800/70 p-4">
                    {editingIndex === index ? (
                      <div className="space-y-3">
                        <input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full rounded-2xl bg-slate-950/60 p-3 text-white outline-none"
                        />

                        <button onClick={saveEditLink} className="rounded-xl bg-green-500 px-4 py-2 text-white">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex min-w-0 flex-col gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Link size={16} className="mt-1 shrink-0 text-indigo-400" />

                          <span className="break-all text-sm text-slate-300">
                            {item}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => startEditLink(index)} className="rounded-xl bg-slate-700 px-3 py-2 text-xs text-white">
                            Edit
                          </button>

                          <button onClick={() => deleteLink(index)} className="rounded-xl bg-red-500 px-3 py-2 text-xs text-white">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="min-w-0">
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, children }) {
  return (
    <label className="min-w-0">
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function Summary({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-4 overflow-hidden rounded-3xl bg-slate-800/70 p-5">
      <span className="mt-1 shrink-0 text-indigo-400">{icon}</span>

      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm font-bold uppercase text-white">
          {value}
        </p>
      </div>
    </div>
  );
}