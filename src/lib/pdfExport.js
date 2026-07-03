import { getControls } from './data';
import { getStatusLabel } from './status';
import { localeStrings } from './i18n';

function buildReportHtml(auditInfo, responses, lang) {
  const controls = getControls(lang);
  const nistData = controls.nist;
  const isoData = controls.iso;
  const strings = localeStrings[lang] || localeStrings.az;

  const tableStyle = 'width:100%;border-collapse:collapse;margin-bottom:30px;font-size:11px;';
  const thStyle = 'border:1px solid #000;padding:6px;background-color:#f0f0f0;text-align:left;font-weight:bold;';
  const tdStyle = 'border:1px solid #000;padding:6px;vertical-align:top;';

  const rowsFor = (data) => data
    .map((control) => {
      const state = responses[control.code] || { status: 'NOT_EVALUATED', notes: '' };
      return `
        <tr style="page-break-inside:avoid;">
          <td style="${tdStyle}"><strong>${control.code}</strong></td>
          <td style="${tdStyle}">${control.name}</td>
          <td style="${tdStyle}">${getStatusLabel(state.status, lang)}</td>
          <td style="${tdStyle}">${state.notes || ''}</td>
        </tr>`;
    })
    .join('');

  return `
    <div style="text-align:center;margin-bottom:30px;border-bottom:2px solid #000;padding-bottom:20px;">
      <h1 style="margin:0 0 10px 0;font-size:22px;">${strings.pdfReportTitle}</h1>
      <div style="display:flex;justify-content:space-between;margin-top:20px;font-size:13px;flex-wrap:wrap;gap:12px;">
        <div><strong>${strings.auditMetaCompany}:</strong> ${auditInfo.companyName}</div>
        <div><strong>${strings.auditMetaAuditor}:</strong> ${auditInfo.auditorName}</div>
        <div><strong>${strings.auditMetaDate}:</strong> ${auditInfo.auditDate}</div>
      </div>
    </div>
    <h2 style="font-size:16px;margin-bottom:12px;">${strings.pdfNistHeading}</h2>
    <table style="${tableStyle}"><thead><tr>
      <th style="${thStyle};width:10%">${strings.controlCode}</th>
      <th style="${thStyle};width:42%">${strings.controlDescription}</th>
      <th style="${thStyle};width:10%">${strings.status}</th>
      <th style="${thStyle};width:38%">${strings.auditorNotes}</th>
    </tr></thead><tbody>
      ${rowsFor(nistData)}
    </tbody></table>
    <h2 style="font-size:16px;margin-bottom:12px;page-break-before:always;">${strings.pdfIsoHeading}</h2>
    <table style="${tableStyle}"><thead><tr>
      <th style="${thStyle};width:10%">${strings.controlCode}</th>
      <th style="${thStyle};width:42%">${strings.controlDescription}</th>
      <th style="${thStyle};width:10%">${strings.status}</th>
      <th style="${thStyle};width:38%">${strings.auditorNotes}</th>
    </tr></thead><tbody>
      ${rowsFor(isoData)}
    </tbody></table>
    <div style="margin-top:40px;text-align:right;font-size:12px;">
      <p>${strings.pdfGeneratedBy}</p>
    </div>
  `;
}

function createPdfElement(html) {
  const element = document.createElement('div');
  element.style.padding = '20px';
  element.style.fontFamily = 'Helvetica, Arial, sans-serif';
  element.style.color = '#000';
  element.style.backgroundColor = '#fff';
  element.innerHTML = html;
  return element;
}

const defaultOptions = {
  margin: 10,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, letterRendering: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  pagebreak: { mode: 'avoid-all' },
};

function getBase64FromDataUri(dataUri) {
  const match = String(dataUri).match(/base64,(.*)$/);
  return match ? match[1] : dataUri;
}

export async function exportToPDF(auditInfo, responses, lang = 'az') {
  const html2pdf = (await import('html2pdf.js')).default;
  const html = buildReportHtml(auditInfo, responses, lang);
  const element = createPdfElement(html);
  const opt = { ...defaultOptions, filename: `audit-hesabati-${auditInfo.companyName.replace(/\s+/g, '-').toLowerCase()}-${auditInfo.auditDate}.pdf` };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF xətası:', error);
    return false;
  }
}

export async function createPdfBase64(auditInfo, responses, lang = 'az') {
  const html2pdf = (await import('html2pdf.js')).default;
  const html = buildReportHtml(auditInfo, responses, lang);
  const element = createPdfElement(html);
  const opt = { ...defaultOptions, filename: `audit-report-${auditInfo.companyName.replace(/\s+/g, '-').toLowerCase()}-${auditInfo.auditDate}.pdf` };

  const dataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring');
  return getBase64FromDataUri(dataUri);
}
