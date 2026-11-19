import { useState } from "react";

export default function ProfileCard({
  user,
  repos,
  darkMode,
  isRTL,
  t,
  matchedQueryLabel,
  formatJoinDate,
}) {
  const [copied, setCopied] = useState(false);

  // حساب أكثر اللغات استخداماً من المستودعات
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const totalWithLang = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([langName, count]) => ({
      name: langName,
      percent: Math.round((count / totalWithLang) * 100),
    }));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`mt-8 sm:mt-10 rounded-2xl p-5 sm:p-7 border transition-colors ${
        darkMode
          ? "bg-slate-800/90 border-slate-700"
          : "bg-white border-slate-300/90 shadow-sm"
      }`}
    >
      {matchedQueryLabel && (
        <p
          className={`text-xs sm:text-sm mb-4 pb-3 border-b font-semibold ${
            darkMode
              ? "text-amber-300/90 border-slate-700/80"
              : "text-amber-800 border-slate-200"
          }`}
        >
          ✨ {t.matchedFromArabic}: <strong>"{matchedQueryLabel}"</strong>
        </p>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={user.avatar_url}
          alt={user.login}
          className={`w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full border-4 ${
            darkMode ? "border-amber-300" : "border-amber-500 shadow-xs"
          }`}
        />

        <div
          className={`flex-1 min-w-0 w-full text-center ${
            isRTL ? "md:text-right" : "md:text-left"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2
                className={`text-2xl sm:text-3xl font-bold break-words ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className={`hover:underline inline-block mt-0.5 font-semibold ${
                  darkMode ? "text-sky-400" : "text-sky-700"
                }`}
              >
                @{user.login}
              </a>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer self-center sm:self-auto ${
                  copied
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : darkMode
                    ? "bg-slate-900 border-slate-700 hover:border-amber-300 text-gray-200"
                    : "bg-slate-100 border-slate-300 hover:border-slate-500 text-slate-900"
                }`}
              >
                {copied ? `✅ ${t.copied}` : `📋 ${t.copyLink}`}
              </button>

              <span
                className={`text-xs font-medium ${
                  darkMode ? "text-gray-400" : "text-slate-700"
                }`}
              >
                {t.joined}: {formatJoinDate(user.created_at)}
              </span>
            </div>
          </div>

          <p
            className={`mt-3 text-sm sm:text-base leading-relaxed font-medium ${
              darkMode ? "text-gray-300" : "text-slate-800"
            }`}
          >
            {user.bio || t.noBio}
          </p>

          {(user.location || user.company || user.blog) && (
            <div
              className={`flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 mt-4 text-xs sm:text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-slate-800"
              }`}
            >
              {user.location && <span>📍 {user.location}</span>}
              {user.company && <span>🏢 {user.company}</span>}
              {user.blog && (
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline break-all font-semibold ${
                    darkMode ? "text-sky-400" : "text-sky-700"
                  }`}
                >
                  🔗 {user.blog}
                </a>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
            <div
              className={`rounded-xl p-3 text-center border ${
                darkMode
                  ? "bg-slate-950 border-slate-800/80"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <p
                className={`text-lg sm:text-xl font-extrabold ${
                  darkMode ? "text-amber-300" : "text-amber-700"
                }`}
              >
                {user.public_repos}
              </p>
              <p
                className={`text-xs sm:text-sm font-semibold ${
                  darkMode ? "text-gray-400" : "text-slate-800"
                }`}
              >
                {t.repos}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 text-center border ${
                darkMode
                  ? "bg-slate-950 border-slate-800/80"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <p
                className={`text-lg sm:text-xl font-extrabold ${
                  darkMode ? "text-amber-300" : "text-amber-700"
                }`}
              >
                {user.followers.toLocaleString()}
              </p>
              <p
                className={`text-xs sm:text-sm font-semibold ${
                  darkMode ? "text-gray-400" : "text-slate-800"
                }`}
              >
                {t.followers}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 text-center border ${
                darkMode
                  ? "bg-slate-950 border-slate-800/80"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <p
                className={`text-lg sm:text-xl font-extrabold ${
                  darkMode ? "text-amber-300" : "text-amber-700"
                }`}
              >
                {user.following}
              </p>
              <p
                className={`text-xs sm:text-sm font-semibold ${
                  darkMode ? "text-gray-400" : "text-slate-800"
                }`}
              >
                {t.following}
              </p>
            </div>
          </div>

          {/* Top Languages Bar */}
          {topLanguages.length > 0 && (
            <div className="mt-6">
              <p
                className={`text-xs font-bold mb-2 ${
                  darkMode ? "text-gray-400" : "text-slate-700"
                }`}
              >
                {t.topLanguages}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {topLanguages.map((item) => (
                  <span
                    key={item.name}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      darkMode
                        ? "bg-slate-900 border-slate-700 text-sky-300"
                        : "bg-sky-50 border-sky-200 text-sky-900"
                    }`}
                  >
                    {item.name} • {item.percent}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}