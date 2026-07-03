import { nistData } from './nistData';
import { nistDataEn } from './nistData_en';
import { isoData } from './isoData';
import { isoDataEn } from './isoData_en';

export const languageData = {
  az: {
    nist: nistData,
    iso: isoData,
  },
  en: {
    nist: nistDataEn,
    iso: isoDataEn,
  },
};

export function getControls(lang = 'az') {
  return languageData[lang] || languageData.az;
}
