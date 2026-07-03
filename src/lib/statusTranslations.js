export const statusTranslations = {
  az: {
    YES: 'Bəli',
    PARTIAL: 'Qismən',
    NO: 'Xeyr',
    NOT_EVALUATED: 'Qiymətləndirilməyib',
  },
  en: {
    YES: 'Yes',
    PARTIAL: 'Partial',
    NO: 'No',
    NOT_EVALUATED: 'Not Evaluated',
  },
};

export function getStatusTranslation(status, lang = 'az') {
  return statusTranslations[lang]?.[status] || statusTranslations.az.NOT_EVALUATED;
}
