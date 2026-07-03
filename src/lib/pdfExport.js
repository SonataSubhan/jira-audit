import { nistData } from './nistData';
import { isoData } from './isoData';
import { getStatusLabel } from './status';

export async function exportToPDF(auditInfo, nistState, isoState) {
  try {
    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Helvetica, Arial, sans-serif';
    element.style.color = '#000';
    element.style.backgroundColor = '#fff';

    let html = `
      <div style="text-align:center;margin-bottom:30px;border-bottom:2px solid #000;padding-bottom:20px;">
        <h1 style="margin:0 0 10px 0;font-size:22px;">KİBERTƏHLÜKƏSİZLİK UYĞUNLUQ AUDİTİ HESABATI</h1>
        <div style="display:flex;justify-content:space-between;margin-top:20px;font-size:13px;">
          <div><strong>Şirkətin Adı:</strong> ${auditInfo.companyName}</div>
          <div><strong>Auditor:</strong> ${auditInfo.auditorName}</div>
          <div><strong>Tarix:</strong> ${auditInfo.auditDate}</div>
        </div>
      </div>
    `;

    const tableStyle = 'width:100%;border-collapse:collapse;margin-bottom:30px;font-size:11px;';
    const thStyle   = 'border:1px solid #000;padding:6px;background-color:#f0f0f0;text-align:left;font-weight:bold;';
    const tdStyle   = 'border:1px solid #000;padding:6px;vertical-align:top;';

    // NIST table
    html += `<h2 style="font-size:16px;margin-bottom:12px;">1. NIST CSF 2.0 Qiymətləndirməsi</h2>
    <table style="${tableStyle}"><thead><tr>
      <th style="${thStyle};width:10%">Kod</th>
      <th style="${thStyle};width:42%">Nəzarət Vasitəsinin Təsviri</th>
      <th style="${thStyle};width:10%">Status</th>
      <th style="${thStyle};width:38%">Auditorun Qeydləri</th>
    </tr></thead><tbody>`;

    nistData.forEach(control => {
      const state = nistState[control.code];
      html += `<tr style="page-break-inside:avoid;">
        <td style="${tdStyle}"><strong>${control.code}</strong></td>
        <td style="${tdStyle}">${control.name}</td>
        <td style="${tdStyle}">${state?.status ? getStatusLabel(state.status) : 'Qiymətləndirilməyib'}</td>
        <td style="${tdStyle}">${state?.notes || ''}</td>
      </tr>`;
    });
    html += `</tbody></table>`;

    // ISO table
    html += `<h2 style="font-size:16px;margin-bottom:12px;page-break-before:always;">2. ISO/IEC 27001 Qiymətləndirməsi</h2>
    <table style="${tableStyle}"><thead><tr>
      <th style="${thStyle};width:10%">Kod</th>
      <th style="${thStyle};width:42%">Nəzarət Vasitəsinin Təsviri</th>
      <th style="${thStyle};width:10%">Status</th>
      <th style="${thStyle};width:38%">Auditorun Qeydləri</th>
    </tr></thead><tbody>`;

    isoData.forEach(control => {
      const state = isoState[control.code];
      html += `<tr style="page-break-inside:avoid;">
        <td style="${tdStyle}"><strong>${control.code}</strong></td>
        <td style="${tdStyle}">${control.name}</td>
        <td style="${tdStyle}">${state?.status ? getStatusLabel(state.status) : 'Qiymətləndirilməyib'}</td>
        <td style="${tdStyle}">${state?.notes || ''}</td>
      </tr>`;
    });
    html += `</tbody></table>`;

    html += `<div style="margin-top:40px;text-align:right;font-size:12px;">
      <p>Hesabat generatoru: <strong>Kibertəhlükəsizlik Auditi Sistemi</strong></p>
    </div>`;

    element.innerHTML = html;

    const opt = {
      margin: 10,
      filename: `audit-hesabati-${auditInfo.companyName.replace(/\s+/g, '-').toLowerCase()}-${auditInfo.auditDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: 'avoid-all' },
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF xətası:', error);
    return false;
  }
}
