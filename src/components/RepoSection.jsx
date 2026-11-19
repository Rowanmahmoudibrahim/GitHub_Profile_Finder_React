
import { useState, useEffect } from "react";

export default function RepoSection({ repos, darkMode, isRTL, t }) {
  const [selectedLang, setSelectedLang] = useState("ALL");
  const [sortBy, setSortBy] = useState("updated");

  // Reset filters when repositories change
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
    <section className="mt-8 sm:mt-10 w-full min-w-0">

      <div className="flex flex-col gap-4 mb-5">

        <h2
          className={`text-lg sm:text-xl md:text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-950"
          }`}
        >
          {t.latestRepos}
        </h2>

        {repos.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <span
              className={`text-xs sm:text-sm font-semibold ${
                darkMode ? "text-gray-400" : "text-slate-700"
              }`}
            >
              {t.sortBy}:
            </span>

            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">

              <button
                type="button"
                onClick={() => setSortBy("updated")}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  sortBy === "updated"
                    ? darkMode
                      ? "bg-amber-300 text-slate-950 border-amber-300"
                      : "bg-amber-400 text-slate-950 border-amber-500"
                    : darkMode
                    ? "bg-slate-900 text-gray-300 border-slate-700 hover:border-amber-300"
                    : "bg-white text-slate-800 border-slate-300 hover:border-amber-500"
                }`}
              >
                {t.sortUpdated}
              </button>

              <button
                type="button"
                onClick={() => setSortBy("stars")}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  sortBy === "stars"
                    ? darkMode
                      ? "bg-amber-300 text-slate-950 border-amber-300"
                      : "bg-amber-400 text-slate-950 border-amber-500"
                    : darkMode
                    ? "bg-slate-900 text-gray-300 border-slate-700 hover:border-amber-300"
                    : "bg-white text-slate-800 border-slate-300 hover:border-amber-500"
                }`}
              >
                {t.sortStars}
              </button>

            </div>
          </div>
        )}
      </div>
      {languages.length > 1 && (
        <div className="mb-5">

          <p
            className={`text-xs sm:text-sm font-semibold mb-3 ${
              darkMode ? "text-gray-400" : "text-slate-700"
            }`}
          >
            {isRTL ? "فلترة حسب اللغة:" : "Filter by language:"}
          </p>

          <div className="flex flex-wrap gap-2 w-full">

            {languages.map((langItem) => {
              const active = selectedLang === langItem;

              return (
                <button
                  key={langItem}
                  type="button"
                  onClick={() => setSelectedLang(langItem)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer break-words ${
                    active
                      ? darkMode
                        ? "bg-amber-300 text-slate-950 border-amber-300"
                        : "bg-amber-400 text-slate-950 border-amber-500"
                      : darkMode
                      ? "bg-slate-900 text-gray-300 border-slate-700 hover:border-sky-400"
                      : "bg-white text-slate-800 border-slate-300 hover:border-sky-500"
                  }`}
                >
                  {langItem === "ALL" ? t.allLanguages : langItem}
                </button>
              );
            })}

          </div>
        </div>
      )}

      {filteredAndSortedRepos.length === 0 ? (
        <div
          className={`p-5 sm:p-7 rounded-xl border text-center text-sm sm:text-base font-medium ${
            darkMode
              ? "bg-slate-800/70 border-slate-700 text-gray-400"
              : "bg-white border-slate-300 text-slate-700"
          }`}
        >
          {t.noRepos}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {filteredAndSortedRepos.map((repo) => (
            <article
              key={repo.id}
              className={`rounded-xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between min-w-0 w-full ${
                darkMode
                  ? "bg-slate-800/90 border-slate-700 hover:border-amber-300/60"
                  : "bg-white border-slate-300/90 hover:border-slate-400 hover:shadow-sm shadow-2xs"
              }`}
            >
              <div className="min-w-0">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className={`text-base sm:text-lg font-bold hover:underline break-all block ${
                    isRTL ? "text-right" : "text-left"
                  } ${darkMode ? "text-sky-300" : "text-sky-700"}`}
                >
                  {repo.name}
                </a>
                <p
                  className={`mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3 break-words font-medium ${
                    darkMode ? "text-gray-400" : "text-slate-800"
                  }`}
                >
                  {repo.description || t.noDesc}
                </p>
              </div>
              <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-3 border-t text-xs sm:text-sm font-semibold ${
                  darkMode
                    ? "border-slate-700/70 text-gray-400"
                    : "border-slate-200 text-slate-800"
                }`}
              >
                <span className="whitespace-nowrap">
                  ⭐ {repo.stargazers_count.toLocaleString()}
                </span>

                <span className="whitespace-nowrap">
                  🍴 {repo.forks_count.toLocaleString()}
                </span>

                <span className="break-words min-w-0">
                  {repo.language || t.noLang}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
