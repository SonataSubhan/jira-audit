'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export default function LoginScreen({ onLogin }) {
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
            Kibertəhlükəsizlik Uyğunluq Auditi
          </h1>
          <p className="text-sm font-mono text-cyan-400/80 uppercase tracking-widest">
            Sistem Girişi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName">Şirkətin Adı</Label>
            <Input
              id="companyName"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Məs. TechCorp MMC"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auditorName">Auditorun Adı Soyadı</Label>
            <Input
              id="auditorName"
              required
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="Məs. Əli Əliyev"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auditDate">Audit Tarixi</Label>
            <Input
              id="auditDate"
              type="date"
              required
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
            />
          </div>

          <Button type="submit" variant="default" className="w-full h-12 text-sm mt-2">
            AUDİTƏ BAŞLA
          </Button>
        </form>
      </div>
    </div>
  );
}
