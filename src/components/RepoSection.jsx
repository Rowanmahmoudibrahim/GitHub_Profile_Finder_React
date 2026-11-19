import { useState, useEffect } from "react";

export default function RepoSection({ repos, darkMode, isRTL, t }) {
  const [selectedLang, setSelectedLang] = useState("ALL");
  const [sortBy, setSortBy] = useState("updated"); // 'updated' | 'stars'

  // إعادة ضبط الفلتر عند البحث عن مستخدم جديد
  useEffect(() => {
    setSelectedLang("ALL");
    setSortBy("updated");
  }, [repos]);

  const languages = [
    "ALL",
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  const filteredAndSortedRepos = repos
    .filter((repo) =>
      selectedLang === "ALL" ? true : repo.language === selectedLang
    )
    .sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2
          className={`text-lg sm:text-xl font-bold ${
            darkMode ? "text-white" : "text-slate-950"
          }`}
        >
          {t.latestRepos}
        </h2>

        {repos.length > 0 && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${
                darkMode ? "text-gray-400" : "text-slate-700"
              }`}
            >
              {t.sortBy}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border outline-none cursor-pointer ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <option value="updated">{t.sortUpdated}</option>
              <option value="stars">{t.sortStars}</option>
            </select>
          </div>
        )}
      </div>

      {/* Language Filter Pills */}
      {languages.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {languages.map((langItem) => {
            const active = selectedLang === langItem;
            return (
              <button
                key={langItem}
                type="button"
                onClick={() => setSelectedLang(langItem)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  active
                    ? darkMode
                      ? "bg-amber-300 text-slate-950 border-amber-300"
                      : "bg-amber-400 text-slate-950 border-amber-500"
                    : darkMode
                    ? "bg-slate-900 text-gray-300 border-slate-700 hover:border-slate-500"
                    : "bg-white text-slate-800 border-slate-300 hover:border-slate-500"
                }`}
              >
                {langItem === "ALL" ? t.allLanguages : langItem}
              </button>
            );
          })}
        </div>
      )}

      {filteredAndSortedRepos.length === 0 ? (
        <p
          className={`font-medium ${
            darkMode ? "text-gray-400" : "text-slate-800"
          }`}
        >
          {t.noRepos}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRepos.map((repo) => (
            <div
              key={repo.id}
              className={`rounded-xl p-4 sm:p-5 border transition flex flex-col justify-between min-w-0 ${
                darkMode
                  ? "bg-slate-800/90 border-slate-700 hover:border-slate-500"
                  : "bg-white border-slate-300/90 hover:border-slate-400 hover:shadow-sm shadow-2xs"
              }`}
            >
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className={`text-lg sm:text-xl font-bold hover:underline break-all block ${
                    isRTL ? "text-right" : "text-left"
                  } ${darkMode ? "text-sky-300" : "text-sky-700"}`}
                >
                  {repo.name}
                </a>

                <p
                  className={`mt-2 text-xs sm:text-sm line-clamp-3 font-medium ${
                    darkMode ? "text-gray-400" : "text-slate-800"
                  }`}
                >
                  {repo.description || t.noDesc}
                </p>
              </div>

              <div
                className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-3 border-t text-xs sm:text-sm font-semibold ${
                  darkMode
                    ? "border-slate-700/70 text-gray-400"
                    : "border-slate-200 text-slate-800"
                }`}
              >
                <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                <span>🍴 {repo.forks_count.toLocaleString()}</span>
                <span className="truncate">{repo.language || t.noLang}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}