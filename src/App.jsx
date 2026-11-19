
import { useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard";
import RepoSection from "./components/RepoSection";

const QUICK_USERS = ["Rowanmahmoudibrahim", "YoussefTurkey", "torvalds"];

const TRANSLATIONS = {
  en: {
    title: "GitHub Profile Finder",
    subtitle: "Discover GitHub profiles and explore their repositories",
    placeholder: "Enter a GitHub username.....",
    search: "Search",
    loadingBtn: "Loading...",
    tryLabel: "Try:",
    searching: "Searching GitHub...",
    emptyError: "Please enter a name or GitHub username!",
    notFoundError: "No matching profile found! Try another name.",
    reposError: "Could not load repositories!",
    matchedFromArabic: "Matched profile for",
    noBio: "No bio yet.",
    repos: "Repos",
    followers: "Followers",
    following: "Following",
    joined: "Joined",
    latestRepos: "Latest Repositories",
    noRepos: "No public repositories found.",
    noDesc: "No description provided.",
    noLang: "Not specified",
    copyLink: "Copy Profile Link",
    copied: "Copied!",
    topLanguages: "Top Languages in Latest Repos:",
    allLanguages: "All",
    sortBy: "Sort by",
    sortUpdated: "Latest Updated",
    sortStars: "Most Stars",
  },

  ar: {
    title: "باحث حسابات GitHub",
    subtitle: "ابحث عن حسابات المطورين واستكشف أحدث مشاريعهم",
    placeholder: " ..... اكتب اسم المستخدم",
    search: "بحث",
    loadingBtn: "جاري البحث...",
    tryLabel: "جرّب:",
    searching: "جاري البحث في GitHub...",
    emptyError: "من فضلك اكتب اسماً أو اسم مستخدم أولاً!",
    notFoundError: "لم يتم العثور على حساب مطابق! جرّب اسماً آخر.",
    reposError: "تعذر تحميل المستودعات!",
    matchedFromArabic: "تم إظهار أقرب حساب لاسم",
    noBio: "لا توجد نبذة تعريفية.",
    repos: "المشاريع",
    followers: "المتابعون",
    following: "يتابع",
    joined: "انضم في",
    latestRepos: "أحدث المستودعات (Repositories)",
    noRepos: "لا توجد مستودعات عامة لهذا الحساب.",
    noDesc: "لا يوجد وصف للمشروع.",
    noLang: "غير محدد",
    copyLink: "نسخ رابط الحساب",
    copied: "تم النسخ!",
    topLanguages: "أكثر اللغات استخداماً في أحدث المشاريع:",
    allLanguages: "الكل",
    sortBy: "ترتيب حسب",
    sortUpdated: "الأحدث تحديثاً",
    sortStars: "الأكثر نجوماً",
  },
};

function hasArabicChars(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function hasEnglishChars(text) {
  return /[A-Za-z]/.test(text);
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("en");

  const [inputValue, setInputValue] = useState("Rowanmahmoudibrahim");
  const [searchQuery, setSearchQuery] = useState("Rowanmahmoudibrahim");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [matchedQueryLabel, setMatchedQueryLabel] = useState("");

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");

  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const dynamicPlaceholder = hasArabicChars(inputValue)
    ? TRANSLATIONS.ar.placeholder
    : hasEnglishChars(inputValue)
    ? TRANSLATIONS.en.placeholder
    : t.placeholder;

  useEffect(() => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;

    const controller = new AbortController();

    async function fetchProfileAndRepos() {
      setLoading(true);
      setErrorKey("");
      setMatchedQueryLabel("");
      setUser(null);
      setRepos([]);

      try {
        let targetUsername = cleanQuery;

        if (hasArabicChars(cleanQuery)) {
          const searchRes = await fetch(
            `https://api.github.com/search/users?q=${encodeURIComponent(cleanQuery)}&per_page=1`,
            { signal: controller.signal }
          );

          if (!searchRes.ok) {
            throw new Error("notFoundError");
          }

          const searchData = await searchRes.json();

          if (!searchData.items || searchData.items.length === 0) {
            throw new Error("notFoundError");
          }

          targetUsername = searchData.items[0].login;
          setMatchedQueryLabel(cleanQuery);
        }

        const userRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(targetUsername)}`,
          { signal: controller.signal }
        );

        if (!userRes.ok) {
          throw new Error("notFoundError");
        }

        const userData = await userRes.json();

        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(userData.login)}/repos?sort=updated&per_page=6`,
          { signal: controller.signal }
        );

        if (!reposRes.ok) {
          throw new Error("reposError");
        }

        const reposData = await reposRes.json();

        setUser(userData);
        setRepos(reposData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorKey(err.message || "notFoundError");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndRepos();

    return () => controller.abort();
  }, [searchQuery, searchTrigger]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed) {
      setErrorKey("emptyError");
      return;
    }

    setSearchQuery(trimmed);
    setSearchTrigger((prev) => prev + 1);
  }

  function handleQuickSearch(name) {
    setInputValue(name);
    setSearchQuery(name);
    setSearchTrigger((prev) => prev + 1);
  }

  const formatJoinDate = (isoDate) => {
    if (!isoDate) return "";

    return new Date(isoDate).toLocaleDateString(
      lang === "ar" ? "ar-EG" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-[#f8fafc] text-slate-950"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-8">

          <div className="w-full min-w-0 text-center sm:text-start">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-slate-950"
              }`}
            >
              {t.title}
            </h1>

            <p
              className={`text-sm sm:text-base mt-2 font-medium ${
                darkMode ? "text-gray-400" : "text-slate-700"
              }`}
            >
              {t.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() =>
                setLang((prev) => (prev === "en" ? "ar" : "en"))
              }
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer whitespace-nowrap ${
                darkMode
                  ? "bg-slate-900 border-slate-700 hover:border-amber-300 text-sky-300"
                  : "bg-white border-slate-300 hover:border-sky-600 text-sky-800 shadow-xs"
              }`}
            >
              {lang === "en" ? "🌐 عربي" : "🌐 English"}
            </button>

            {/* Dark / Light Button */}
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer whitespace-nowrap ${
                darkMode
                  ? "bg-slate-900 border-slate-700 hover:border-amber-300 text-amber-300"
                  : "bg-white border-slate-300 hover:border-amber-600 text-amber-900 shadow-xs"
              }`}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <input
            type="text"
            dir="auto"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={dynamicPlaceholder}
            className={`w-full sm:flex-1 min-w-0 px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
              isRTL ? "text-right" : "text-left"
            } ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white focus:border-amber-300"
                : "bg-white border-slate-300 text-slate-950 placeholder:text-slate-600 focus:border-amber-600 shadow-xs"
            }`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold transition cursor-pointer shrink-0 disabled:opacity-50 ${
              darkMode
                ? "bg-amber-300 text-slate-950 hover:bg-amber-400"
                : "bg-amber-400 text-slate-950 hover:bg-amber-500 shadow-xs"
            }`}
          >
            {loading ? t.loadingBtn : t.search}
          </button>
        </form>

        <div className="mt-6">

          <div className="mb-3">
            <span
              className={`text-sm font-bold ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {lang === "en" ? "Try These Users" : "جرّب الحسابات دي"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">

            {QUICK_USERS.map((name, index) => (
              <button
                key={name}
                type="button"
                onClick={() => handleQuickSearch(name)}
                className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer text-center break-all ${
                  index === 2
                    ? "col-span-2 justify-self-center w-fit max-w-full"
                    : "w-full min-w-0"
                } ${
                  darkMode
                    ? "bg-slate-900/80 border-slate-700 text-sky-300 hover:border-amber-300 hover:text-amber-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-sky-800 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 shadow-sm"
                }`}
              >
                {name}
              </button>
            ))}

          </div>
        </div>

        {loading && (
          <div className="text-center mt-14">
            <div
              className={`w-10 h-10 border-4 rounded-full animate-spin mx-auto ${
                darkMode
                  ? "border-slate-700 border-t-amber-300"
                  : "border-slate-300 border-t-amber-600"
              }`}
            ></div>

            <p
              className={`mt-4 font-medium ${
                darkMode ? "text-gray-400" : "text-slate-800"
              }`}
            >
              {t.searching}
            </p>
          </div>
        )}

        {errorKey && !loading && (
          <div
            className={`mt-10 p-4 rounded-xl border text-center text-sm sm:text-base font-semibold ${
              darkMode
                ? "bg-red-950/50 border-red-800 text-red-300"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            {t[errorKey] || t.notFoundError}
          </div>
        )}

        {user && !loading && (
          <>
            <ProfileCard
              user={user}
              repos={repos}
              darkMode={darkMode}
              isRTL={isRTL}
              t={t}
              matchedQueryLabel={matchedQueryLabel}
              formatJoinDate={formatJoinDate}
            />

            <RepoSection
              repos={repos}
              darkMode={darkMode}
              isRTL={isRTL}
              t={t}
            />
          </>
        )}

      </div>
    </div>
  );
}
