'use client';

export default function ProgressBar({ states, totalControls }) {
  const counts = { beli: 0, qismen: 0, xeyr: 0, nt: 0 };

  Object.values(states).forEach((state) => {
    if (state.status && counts[state.status] !== undefined) {
      counts[state.status]++;
    }
  });

  const answered = counts.beli + counts.qismen + counts.xeyr + counts.nt;
  const empty = totalControls - answered;
  const completionPct = totalControls > 0 ? Math.round((answered / totalControls) * 100) : 0;

  const pct = (n) => (totalControls > 0 ? (n / totalControls) * 100 : 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-4 mb-4">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <Stat label="Cəmi"               value={totalControls} />
          <Stat label="Bəli"               value={counts.beli}    color="#00FF66" />
          <Stat label="Qismən"             value={counts.qismen}  color="#FFD700" />
          <Stat label="Xeyr"               value={counts.xeyr}    color="#FF3B3B" />
          <Stat label="N/T"                value={counts.nt}      color="#9ca3af" />
          <Stat label="Qiymətləndirilməyib" value={empty}         color="#6b7280" />
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-mono text-cyan-400">{completionPct}%</div>
          <div className="text-[10px] text-white/50 font-mono uppercase">Tamamlanıb</div>
        </div>
      </div>

      <div className="h-2 w-full bg-white/10 rounded-sm overflow-hidden flex">
        {pct(counts.beli)   > 0 && <div style={{ width: `${pct(counts.beli)}%`,   backgroundColor: '#00FF66' }} />}
        {pct(counts.qismen) > 0 && <div style={{ width: `${pct(counts.qismen)}%`, backgroundColor: '#FFD700' }} />}
        {pct(counts.xeyr)   > 0 && <div style={{ width: `${pct(counts.xeyr)}%`,   backgroundColor: '#FF3B3B' }} />}
        {pct(counts.nt)     > 0 && <div style={{ width: `${pct(counts.nt)}%`,     backgroundColor: '#9ca3af' }} />}
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
