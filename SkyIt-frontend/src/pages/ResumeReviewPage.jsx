import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Send,
  MessageCircle,
} from "lucide-react";

const API_URL = "http://localhost:8099";

export default function ResumeReviewPage() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState({
    startIndex: null,
    endIndex: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Нет токена. Войди через Keycloak заново.");
      throw new Error("Token not found");
    }

    return token;
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Можно загрузить только PDF файл");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setResume(null);
    setSelectedText("");
    setMessage("");
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Сначала выбери PDF файл");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = getToken();

      const response = await fetch(`${API_URL}/resumes/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("Ошибка загрузки резюме");
        return;
      }

      const data = await response.json();
      setResume(data);
      alert("Резюме успешно загружено");
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSelection = () => {
    if (!resume?.extractedText) return;

    const selection = window.getSelection();
    const text = selection.toString();

    if (!text.trim()) return;

    const startIndex = resume.extractedText.indexOf(text);
    const endIndex = startIndex + text.length;

    setSelectedText(text);
    setSelectionRange({
      startIndex,
      endIndex,
    });
  };

  const sendMessage = async () => {
    if (!resume) {
      alert("Сначала загрузи резюме");
      return;
    }

    if (!message.trim()) {
      alert("Напиши сообщение");
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/resumes/${resume.resumeId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            selectedText,
            startIndex: selectionRange.startIndex,
            endIndex: selectionRange.endIndex,
          }),
        }
      );

      if (!response.ok) {
        alert("Ошибка отправки сообщения");
        return;
      }

      const data = await response.json();

      setResume(data);
      setMessage("");
      setSelectedText("");
      setSelectionRange({
        startIndex: null,
        endIndex: null,
      });
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
        <h1 className="text-4xl font-bold text-white">Resume Review</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Upload a PDF resume, highlight any text, and ask questions about specific sections.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950 p-12 text-center transition hover:border-indigo-500">
              <Upload size={48} className="text-indigo-400" />

              <h2 className="mt-5 text-2xl font-bold text-white">
                Upload your resume
              </h2>

              <p className="mt-2 text-slate-400">
                Only PDF files are supported.
              </p>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-indigo-500/20 p-3">
                    <FileText className="text-indigo-300" />
                  </div>

                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  className="rounded-xl bg-slate-700 p-2 text-slate-200 hover:bg-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <button
              onClick={uploadResume}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-indigo-500 px-5 py-4 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {resume && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Extracted Text
                  </h2>
                  <p className="text-sm text-slate-400">
                    Select text with your mouse, then ask a question in the panel on the right..
                  </p>
                </div>

                <div className="rounded-2xl bg-indigo-500/20 px-4 py-2 text-indigo-200">
                  Score: {resume.score || 0}/100
                </div>
              </div>

              <div
                onMouseUp={handleTextSelection}
                className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-700 bg-slate-950 p-6 text-sm leading-7 text-slate-200"
              >
                {resume.extractedText}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {resume && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">Analysis</h2>

              <div className="mt-6 space-y-4 text-sm">
                <Block title="Summary" text={resume.summary} />
                <Block title="Strengths" text={resume.strengths} />
                <Block title="Weaknesses" text={resume.weaknesses} />
                <Block title="Recommendations" text={resume.recommendations} />
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Review Thread</h2>
            </div>

            {selectedText && (
              <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <p className="text-xs uppercase text-indigo-300">
                  Selected text
                </p>
                <p className="mt-2 text-sm text-slate-200">{selectedText}</p>
              </div>
            )}

            <div className="mt-6 max-h-[420px] space-y-4 overflow-auto">
              {resume?.messages?.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 ${
                    item.role === "USER"
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  <p className="text-xs font-bold opacity-70">{item.role}</p>

                  {item.selectedText && (
                    <p className="mt-2 rounded-xl bg-black/20 p-3 text-xs">
                      “{item.selectedText}”
                    </p>
                  )}

                  <p className="mt-2 text-sm">{item.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask how to improve resume..."
                className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none"
              />

              <button
                onClick={sendMessage}
                className="rounded-2xl bg-indigo-500 px-5 text-white"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-white">What are checked</h2>

            <div className="mt-6 space-y-4">
              {[
              "Java / Spring Stack",
              "Experience and Projects",
              "Key Skills",
              "CV Structure Issues",
              "Suggestions for Improvement"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle size={18} className="text-indigo-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4">
      <p className="text-xs font-bold uppercase text-indigo-300">{title}</p>
      <p className="mt-2 text-slate-300">{text || "Нет данных"}</p>
    </div>
  );
}