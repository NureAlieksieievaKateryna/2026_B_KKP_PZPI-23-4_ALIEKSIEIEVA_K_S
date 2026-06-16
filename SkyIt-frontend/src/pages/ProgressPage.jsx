export default function ProgressPage() {

  return (
    <div className="space-y-6">

      <h1 className="text-4xl font-bold text-white">
        Progress
      </h1>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="space-y-5">

          <div>
            <div className="mb-2 text-white">
              Spring Boot
            </div>

            <div className="h-4 rounded-full bg-slate-800">
              <div className="h-4 w-3/4 rounded-full bg-indigo-500"></div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-white">
              Docker
            </div>

            <div className="h-4 rounded-full bg-slate-800">
              <div className="h-4 w-1/2 rounded-full bg-indigo-500"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}