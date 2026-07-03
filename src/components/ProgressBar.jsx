'use client';

import { useLanguage } from '@/lib/LanguageProvider';
import { STATUS_ENUM } from '@/lib/status';

export default function ProgressBar({ states, totalControls }) {
  const { t } = useLanguage();
  const counts = {
    [STATUS_ENUM.YES]: 0,
    [STATUS_ENUM.PARTIAL]: 0,
    [STATUS_ENUM.NO]: 0,
    [STATUS_ENUM.NOT_EVALUATED]: 0,
  };

  Object.values(states).forEach((state) => {
    if (!state || !state.status) {
      counts[STATUS_ENUM.NOT_EVALUATED]++;
    } else if (counts[state.status] !== undefined) {
      counts[state.status]++;
    }
  });

  const answered = counts[STATUS_ENUM.YES] + counts[STATUS_ENUM.PARTIAL] + counts[STATUS_ENUM.NO];
  const empty = counts[STATUS_ENUM.NOT_EVALUATED];
  const completionPct = totalControls > 0 ? Math.round((answered / totalControls) * 100) : 0;

  const pct = (n) => (totalControls > 0 ? (n / totalControls) * 100 : 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-4 mb-4">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <Stat label={t('total')}               value={totalControls} />
          <Stat label={t('yes')}                 value={counts[STATUS_ENUM.YES]}         color="#00FF66" />
          <Stat label={t('partial')}             value={counts[STATUS_ENUM.PARTIAL]}     color="#FFD700" />
          <Stat label={t('no')}                  value={counts[STATUS_ENUM.NO]}          color="#FF3B3B" />
          <Stat label={t('na')}                  value={empty}                           color="#9ca3af" />
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-mono text-cyan-400">{completionPct}%</div>
          <div className="text-[10px] text-white/50 font-mono uppercase">{t('completion')}</div>
        </div>
      </div>

      <div className="h-2 w-full bg-white/10 rounded-sm overflow-hidden flex">
        {pct(counts[STATUS_ENUM.YES])         > 0 && <div style={{ width: `${pct(counts[STATUS_ENUM.YES])}%`,         backgroundColor: '#00FF66' }} />}
        {pct(counts[STATUS_ENUM.PARTIAL])     > 0 && <div style={{ width: `${pct(counts[STATUS_ENUM.PARTIAL])}%`,     backgroundColor: '#FFD700' }} />}
        {pct(counts[STATUS_ENUM.NO])          > 0 && <div style={{ width: `${pct(counts[STATUS_ENUM.NO])}%`,          backgroundColor: '#FF3B3B' }} />}
        {pct(counts[STATUS_ENUM.NOT_EVALUATED]) > 0 && <div style={{ width: `${pct(counts[STATUS_ENUM.NOT_EVALUATED])}%`, backgroundColor: '#9ca3af' }} />}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-mono text-white/50 uppercase mb-1 whitespace-nowrap">{label}</span>
      <span className="text-lg font-mono" style={{ color: color || 'white' }}>{value}</span>
    </div>
  );
}
