import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { defaultLang, localeStrings } from '@/lib/i18n';
import { getStatusLabel } from '@/lib/status';
import { getControls } from '@/lib/data';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE !== 'false';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const emailFrom = process.env.EMAIL_FROM || smtpUser;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
  console.warn('SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in .env.local.');
}

function getLocalizedStrings(lang) {
  return localeStrings[lang] || localeStrings[defaultLang];
}

function getControlData(control, state, lang) {
  const statusLabel = state?.status ? getStatusLabel(state.status, lang) : getStatusLabel(null, lang);
  return `
    <tr>
      <td style="border:1px solid #ccc;padding:8px"><strong>${control.code}</strong></td>
      <td style="border:1px solid #ccc;padding:8px">${control.name}</td>
      <td style="border:1px solid #ccc;padding:8px">${statusLabel}</td>
      <td style="border:1px solid #ccc;padding:8px">${state?.notes || '-'}</td>
    </tr>
  `;
}

function renderSection(title, controls, stateMap, lang) {
  const rows = controls
    .map((control) => getControlData(control, stateMap[control.code], lang))
    .join('');

  if (!rows) {
    return `<p>${title} - ${getLocalizedStrings(lang).notEvaluated}</p>`;
  }

  return `
    <h2 style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;">${title}</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;font-family:Arial,Helvetica,sans-serif;">
      <thead>
        <tr style="background:#f3f4f6;color:#111827;text-align:left;">
          <th style="border:1px solid #d1d5db;padding:10px;">${getLocalizedStrings(lang).controlCode}</th>
          <th style="border:1px solid #d1d5db;padding:10px;">${getLocalizedStrings(lang).controlDescription}</th>
          <th style="border:1px solid #d1d5db;padding:10px;">${getLocalizedStrings(lang).status}</th>
          <th style="border:1px solid #d1d5db;padding:10px;">${getLocalizedStrings(lang).auditorNotes}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function buildEmailHtml(auditInfo, responses, lang, nistControls, isoControls) {
  const strings = getLocalizedStrings(lang);

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6;">
      <h1 style="font-size:24px;margin-bottom:10px;">${strings.welcomeTitle}</h1>
      <p><strong>${strings.auditMetaCompany}:</strong> ${auditInfo.companyName}</p>
      <p><strong>${strings.auditMetaAuditor}:</strong> ${auditInfo.auditorName}</p>
      <p><strong>${strings.auditMetaDate}:</strong> ${auditInfo.auditDate}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #d1d5db;" />
      ${renderSection(strings.nistSection, nistControls, responses, lang)}
      ${renderSection(strings.isoSection, isoControls, responses, lang)}
      <p style="margin-top:24px;color:#6b7280;font-size:13px;">${strings.welcomeTitle} • ${new Date().toLocaleDateString()}</p>
    </div>
  `;
}

export async function POST(request) {
  if (!request) {
    return NextResponse.json({ error: 'Request missing' }, { status: 400 });
  }

  const body = await request.json();
  const { recipient, auditInfo, responses, lang = defaultLang } = body;
  const userLang = ['az', 'en'].includes(lang) ? lang : defaultLang;
  const strings = getLocalizedStrings(userLang);
  const controls = getControls(userLang);
  const nistData = controls.nist;
  const isoData = controls.iso;

  if (!recipient || !auditInfo || !auditInfo.companyName || !auditInfo.auditorName || !auditInfo.auditDate) {
    return NextResponse.json({ error: 'Required payload fields are missing.' }, { status: 400 });
  }

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: 'SMTP is not configured. Please set SMTP environment variables.' }, { status: 500 });
  }

  if (!body.pdfData) {
    return NextResponse.json({ error: 'PDF data is missing from the request.' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com',
        ciphers: 'SSLv3',
      },
    });

    await transporter.verify();

    const html = buildEmailHtml(auditInfo, responses || {}, userLang, nistData, isoData);
    const subject = `${strings.welcomeTitle} — ${auditInfo.companyName}`;

    await transporter.sendMail({
      from: emailFrom,
      to: recipient,
      subject,
      html,
      attachments: [
        {
          filename: `audit-report-${auditInfo.companyName}.pdf`,
          content: body.pdfData,
          encoding: 'base64',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SMTP send error:', error);
    return NextResponse.json(
      { error: 'Failed to send report email.', details: error.message },
      { status: 500 }
    );
  }
}