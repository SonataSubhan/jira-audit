'use client';

import { useState } from 'react';
import { FileDown, Mail, ShieldAlert, LogOut, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import ControlTable from '@/components/ControlTable';
import ProgressBar from '@/components/ProgressBar';
import EmailModal from '@/components/EmailModal';
import { nistData } from '@/lib/nistData';
import { isoData } from '@/lib/isoData';
import { exportToPDF } from '@/lib/pdfExport';
import { useToast } from '@/lib/useToast';

export default function Dashboard({ auditInfo, onLogout }) {
  const [nistState, setNistState] = useState({});
  const [isoState,  setIsoState]  = useState({});
  const [activeTab, setActiveTab] = useState('nist');
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailOpen,  setIsEmailOpen]  = useState(false);
  const { toast } = useToast();

  const handleNist = (code, state) => setNistState((p) => ({ ...p, [code]: state }));
  const handleIso  = (code, state) => setIsoState( (p) => ({ ...p, [code]: state }));

  const handleExportPDF = async () => {
    setIsExporting(true);
    toast({ title: 'PDF Hazırlanır...', description: 'Hesabatınız formalaşdırılır, zəhmət olmasa gözləyin.' });
    const ok = await exportToPDF(auditInfo, nistState, isoState);
    setIsExporting(false);
    if (ok) {
      toast({ title: 'Uğurlu əməliyyat', description: 'PDF hesabatı uğurla yükləndi.' });
    } else {
      toast({ title: 'Xəta', description: 'PDF hesabatını yaratmaq mümkün olmadı.', variant: 'destructive' });
    }
  };

  const currentStates = activeTab === 'nist' ? nistState : isoState;
  const currentTotal  = activeTab === 'nist' ? nistData.length : isoData.length;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[1600px] mx-auto">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10">
        {/* Main row */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-14 sm:h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center rounded-sm shrink-0">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-mono font-medium text-cyan-50 tracking-wide text-sm sm:text-base truncate">
              JIRA AUDİTİ
            </span>
          </div>

          {/* Audit meta — desktop only */}
          <div className="hidden lg:flex flex-col items-center shrink-0">
            <div className="text-sm font-medium text-white/90">{auditInfo.companyName}</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex gap-2 flex-wrap justify-center">
              <span>AUDİTOR: <span className="text-cyan-400">{auditInfo.auditorName}</span></span>
              <span>|</span>
              <span>TARİX: <span className="text-cyan-400">{auditInfo.auditDate}</span></span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting
                ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                : <FileDown className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">PDF Çıxar</span>
            </Button>

            <Button
              variant="cyan"
              onClick={() => setIsEmailOpen(true)}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Hesabat Göndər</span>
            </Button>

            <button
              onClick={onLogout}
              title="Çıxış"
              className="h-9 w-9 flex items-center justify-center rounded-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile: audit meta row */}
        <div className="lg:hidden flex flex-wrap items-center gap-x-2 gap-y-0.5 px-4 pb-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span className="text-white/70">{auditInfo.companyName}</span>
          <span>·</span>
          <span>AUDİTOR: <span className="text-cyan-400">{auditInfo.auditorName}</span></span>
          <span>·</span>
          <span>TARİX: <span className="text-cyan-400">{auditInfo.auditDate}</span></span>
        </div>
      </header>

      {/* ── Main content — natural page scroll ── */}
      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
          <TabsList className="w-full sm:w-[400px]">
            <TabsTrigger value="nist">NIST CSF 2.0</TabsTrigger>
            <TabsTrigger value="iso">ISO/IEC 27001</TabsTrigger>
          </TabsList>

          <ProgressBar states={currentStates} totalControls={currentTotal} />

          <TabsContent value="nist">
            <ControlTable controls={nistData} states={nistState} onStateChange={handleNist} />
          </TabsContent>
          <TabsContent value="iso">
            <ControlTable controls={isoData}  states={isoState}  onStateChange={handleIso}  />
          </TabsContent>
        </Tabs>
      </main>

      <EmailModal
        open={isEmailOpen}
        onOpenChange={setIsEmailOpen}
        auditInfo={auditInfo}
        nistState={nistState}
        isoState={isoState}
      />
    </div>
  );
}
