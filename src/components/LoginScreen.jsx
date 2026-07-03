'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useLanguage } from '@/lib/LanguageProvider';

export default function LoginScreen({ onLogin }) {
  const { t } = useLanguage();
  const [companyName, setCompanyName] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditDate, setAuditDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName && auditorName && auditDate) {
      onLogin({ companyName, auditorName, auditDate });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 mb-6">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-2 text-center">
            {t('welcomeTitle')}
          </h1>
          <p className="text-sm font-mono text-cyan-400/80 uppercase tracking-widest">
            {t('welcomeSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName">{t('companyLabel')}</Label>
            <Input
              id="companyName"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t('companyPlaceholder')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auditorName">{t('auditorLabel')}</Label>
            <Input
              id="auditorName"
              required
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder={t('auditorPlaceholder')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auditDate">{t('auditDateLabel')}</Label>
            <Input
              id="auditDate"
              type="date"
              required
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
            />
          </div>

          <Button type="submit" variant="default" className="w-full h-12 text-sm mt-2">
            {t('startAudit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
