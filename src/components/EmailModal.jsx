'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useToast } from '@/lib/useToast';
import { nistData } from '@/lib/nistData';
import { isoData } from '@/lib/isoData';
import { getStatusLabel } from '@/lib/status';

export default function EmailModal({ open, onOpenChange, auditInfo, nistState, isoState }) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const buildTable = (controls, stateMap, title) => {
    let rows = '';
    controls.forEach((c) => {
      const s = stateMap[c.code];
      if (s?.status) {
        rows += `<tr>
          <td style="border:1px solid #ccc;padding:6px"><strong>${c.code}</strong></td>
          <td style="border:1px solid #ccc;padding:6px">${c.name}</td>
          <td style="border:1px solid #ccc;padding:6px">${getStatusLabel(s.status)}</td>
          <td style="border:1px solid #ccc;padding:6px">${s.notes || '-'}</td>
        </tr>`;
      }
    });
    if (!rows) return '';
    return `<h2 style="font-family:sans-serif;color:#444">${title}</h2>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px">
      <tr style="background:#f5f5f5"><th>Kod</th><th>Nəzarət</th><th>Status</th><th>Qeydlər</th></tr>
      ${rows}
    </table><br/>`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);

    try {
      const htmlContent = `
        <h1 style="font-family:sans-serif;color:#333">Kibertəhlükəsizlik Uyğunluq Auditi Hesabatı</h1>
        <p><strong>Şirkət:</strong> ${auditInfo.companyName}</p>
        <p><strong>Auditor:</strong> ${auditInfo.auditorName}</p>
        <p><strong>Tarix:</strong> ${auditInfo.auditDate}</p>
        <hr/>
        ${buildTable(nistData, nistState, 'NIST CSF 2.0 Nəticələri')}
        ${buildTable(isoData, isoState, 'ISO/IEC 27001 Nəticələri')}
      `;

      const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const emailjs = (await import('@emailjs/browser')).default;
        await emailjs.send(serviceId, templateId, {
          to_email:     email,
          company_name: auditInfo.companyName,
          auditor_name: auditInfo.auditorName,
          audit_date:   auditInfo.auditDate,
          audit_html:   htmlContent,
        }, publicKey);
      } else {
        // Demo mode — no keys configured yet
        await new Promise((r) => setTimeout(r, 1200));
      }

      toast({ title: 'Hesabat uğurla göndərildi', description: `${email} ünvanına audit hesabatı göndərildi.` });
      onOpenChange(false);
      setEmail('');
    } catch (err) {
      console.error(err);
      toast({ title: 'Xəta baş verdi', description: 'Hesabatı göndərmək mümkün olmadı.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hesabat Göndər</DialogTitle>
          <DialogDescription>
            Audit hesabatını göndərmək istədiyiniz e-poçt ünvanını daxil edin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSend} className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-poçt ünvanı</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shirket.com"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Ləğv et
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSending}
              className="gap-2"
            >
              {isSending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> GÖNDƏRİLİR...</>
                : <><Send className="w-4 h-4" /> GÖNDƏR</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
