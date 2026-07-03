'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import Textarea from '@/components/ui/Textarea';
import { getStatusLabel, getStatusColor, STATUS_ENUM } from '@/lib/status';
import { useLanguage } from '@/lib/LanguageProvider';

const STATUS_OPTIONS = [
  { status: STATUS_ENUM.YES, key: 'yes' },
  { status: STATUS_ENUM.PARTIAL, key: 'partial' },
  { status: STATUS_ENUM.NO, key: 'no' },
  { status: STATUS_ENUM.NOT_EVALUATED, key: 'na' },
];

export default function ControlTable({ controls, states, onStateChange }) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (code) =>
    setExpandedRows((prev) => ({ ...prev, [code]: !prev[code] }));

  const handleStatus = (code, newStatus) => {
    const cur = states[code] || { status: STATUS_ENUM.NOT_EVALUATED, notes: '' };
    onStateChange(code, { ...cur, status: newStatus });
    if (!expandedRows[code]) setExpandedRows((prev) => ({ ...prev, [code]: true }));
  };

  const handleNotes = (code, notes) => {
    const cur = states[code] || { status: STATUS_ENUM.NOT_EVALUATED, notes: '' };
    onStateChange(code, { ...cur, notes });
  };

  const { t, lang } = useLanguage();

  return (
    <div className="border border-white/10 rounded-sm bg-black ">
      {/* Desktop header */}
      <div className="hidden md:grid md:grid-cols-[140px_1fr_auto] gap-0 border-b border-white/10 bg-white/5 text-[11px] font-mono uppercase text-white/50 sticky top-14 z-10">
        <div className="px-4 py-3">{t('controlCode')}</div>
        <div className="px-4 py-3">{t('controlDescription')}</div>
        <div className="px-4 py-3 text-center min-w-[260px]">{t('status')}</div>
      </div>

      <div>
        {controls.map((control) => {
          const state = states[control.code] || { status: STATUS_ENUM.NOT_EVALUATED, notes: '' };
          const isExpanded = !!expandedRows[control.code];
          const color = getStatusColor(state.status);

          return (
            <div key={control.code} className="border-b border-white/5 last:border-0">
              {/* ── Desktop row ── */}
              <div
                className="hidden md:grid md:grid-cols-[140px_1fr_auto] gap-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggleRow(control.code)}
              >
                {/* Code */}
                <div className="px-4 py-3 flex items-center gap-2 font-mono text-sm text-[#00FF66] shrink-0">
                  {isExpanded
                    ? <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
                    : <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />}
                  <span className="whitespace-nowrap">{control.code}</span>
                </div>

                {/* Name */}
                <div className="px-4 py-3 text-sm text-white/85 min-w-0 break-words leading-relaxed self-center">
                  {control.name}
                </div>

                {/* Status buttons */}
                <div
                  className="px-4 py-3 flex gap-1 items-center justify-end min-w-[260px] flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {STATUS_OPTIONS.map(({ status, key }) => (
                    <StatusBtn
                      key={status}
                      status={status}
                      label={t(key)}
                      current={state.status}
                      onClick={() => handleStatus(control.code, status)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Mobile row ── */}
              <div className="md:hidden">
                <div
                  className="px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleRow(control.code)}
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 font-mono text-sm text-[#00FF66] min-w-0">
                      {isExpanded
                        ? <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
                        : <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />}
                      <span className="truncate">{control.code}</span>
                    </div>
                    {state.status && color && (
                      <span
                        className="shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border whitespace-nowrap"
                        style={{
                          color,
                          borderColor: color + '40',
                          backgroundColor: color + '18',
                        }}
                      >
                        {getStatusLabel(state.status, lang)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed break-words mb-3">
                    {control.name}
                  </p>
                  <div
                    className="flex gap-1 flex-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUS_OPTIONS.map(({ status, key }) => (
                      <StatusBtn
                        key={status}
                        status={status}
                        label={t(key)}
                        current={state.status}
                        onClick={() => handleStatus(control.code, status)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Expanded detail ── */}
              {isExpanded && (
                <div className="bg-white/[0.02] px-4 sm:px-6 py-5 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-mono text-white/40 uppercase mb-3">
                      {t('fullDescription')}
                    </h4>
                    <div className="text-sm text-white/80 leading-relaxed p-4 bg-black/50 border border-white/5 rounded-sm break-words">
                      {control.description || control.name}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-white/40 uppercase mb-3 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> {t('auditorNotes')}
                    </h4>
                    <Textarea
                      value={state.notes}
                      onChange={(e) => handleNotes(control.code, e.target.value)}
                      placeholder={t('notesPlaceholder')}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBtn({ status, label, current, onClick }) {
  const color = getStatusColor(status);
  const isSelected = current === status;

  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
      style={
        isSelected
          ? { color, borderColor: color + '50', backgroundColor: color + '20', boxShadow: `0 0 8px ${color}18` }
          : { color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.1)' }
      }
    >
      {label}
    </button>
  );
}
