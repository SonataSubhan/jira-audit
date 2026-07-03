'use client';

import { useLanguage } from '@/lib/LanguageProvider';

export default function LanguageSwitcher() {
  const { lang, setLang, languageNames, t } = useLanguage();

  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <span className="text-xs uppercase tracking-[0.2em] text-white/50">{t('languageLabel')}:</span>
      {Object.entries(languageNames).map(([code, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`rounded-sm border px-3 py-1 text-sm transition ${lang === code ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-white/10 text-white/70 hover:border-white/20 hover:text-white'}`}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
