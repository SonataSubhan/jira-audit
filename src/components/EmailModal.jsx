'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useToast } from '@/lib/useToast';
import { useLanguage } from '@/lib/LanguageProvider';

export default function EmailModal({ open, onOpenChange, auditInfo, responses, lang }) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: email,
          lang,
          auditInfo,
          responses,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to send');
      }

      toast({ title: t('emailSentTitle'), description: t('emailSentDescription') });
      onOpenChange(false);
      setEmail('');
    } catch (err) {
      console.error(err);
      toast({ title: t('emailErrorTitle'), description: t('emailErrorDescription'), variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reportTitle')}</DialogTitle>
          <DialogDescription>{t('reportDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSend} className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSending}
              className="gap-2"
            >
              {isSending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('emailSending')}</>
                : <><Send className="w-4 h-4" /> {t('send')}</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
