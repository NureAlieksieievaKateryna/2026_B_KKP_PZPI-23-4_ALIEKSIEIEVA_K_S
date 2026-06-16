import { useState } from "react";

export default function RegisterPage({ setPage }) {
  const [form, setForm] = useState({
    userName: "",
    login: "",
    email: "",
    password: "",
    fullName: "",
    targetPosition: "JAVA_DEVELOPER",
    currentLevel: "JUNIOR",
    desiredLevel: "MIDDLE",
    country: "UKRAINE",
    officeType: "REMOTE",
    bio: "",
    helpfulLinksUrl: [],
  });

  const [link, setLink] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    if (!link.trim()) return;

    setForm({
      ...form,
      helpfulLinksUrl: [...form.helpfulLinksUrl, link],
    });

    setLink("");
  };

  const handleRegister = async () => {
    const response = await fetch("http://localhost:8099/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);

    setPage("dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="mt-2 text-slate-400">Создай профиль для подготовки</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="userName" placeholder="Username" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none" />
          <input name="login" placeholder="Login" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none" />
          <input name="email" placeholder="Email" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none" />
          <input name="fullName" placeholder="Full name" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none" />

          <select name="targetPosition" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none">
            <option value="JAVA_DEVELOPER">Java Developer</option>
            <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
            <option value="FULLSTACK_DEVELOPER">Fullstack Developer</option>
          </select>

          <select name="currentLevel" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none">
            <option value="JUNIOR">Junior</option>
            <option value="MIDDLE">Middle</option>
            <option value="SENIOR">Senior</option>
          </select>

          <select name="desiredLevel" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none">
            <option value="JUNIOR">Junior</option>
            <option value="MIDDLE">Middle</option>
            <option value="SENIOR">Senior</option>
          </select>

          <select name="country" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none">
            <option value="UKRAINE">Ukraine</option>
            <option value="POLAND">Poland</option>
            <option value="GERMANY">Germany</option>
          </select>

          <select name="officeType" onChange={handleChange} className="rounded-2xl bg-slate-800 p-4 outline-none">
            <option value="REMOTE">Remote</option>
            <option value="OFFICE">Office</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <textarea
          name="bio"
          placeholder="Bio"
          onChange={handleChange}
          className="mt-4 h-28 w-full rounded-2xl bg-slate-800 p-4 outline-none"
        />

        <div className="mt-4 flex gap-3">
          <input
            placeholder="Helpful link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-1 rounded-2xl bg-slate-800 p-4 outline-none"
          />

          <button onClick={addLink} className="rounded-2xl bg-slate-700 px-5">
            Add
          </button>
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full rounded-2xl bg-indigo-500 px-5 py-3 font-medium text-white"
        >
          Register
        </button>

        <button
          onClick={() => setPage("login")}
          className="mt-3 w-full rounded-2xl bg-slate-800 px-5 py-3 font-medium"
        >
          Already have account? Login
        </button>
      </div>
    </div>
  );
}import keycloak from "../keycloak";
