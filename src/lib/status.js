export const STATUS_ENUM = {
  YES: 'YES',
  PARTIAL: 'PARTIAL',
  NO: 'NO',
  NOT_EVALUATED: 'NOT_EVALUATED',
};

export function getStatusLabel(status, lang = 'az') {
  const labels = {
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

  const map = labels[lang] || labels.az;
  return map[status] || map.NOT_EVALUATED;
}

export function getStatusColor(status) {
  switch (status) {
    case STATUS_ENUM.YES: return '#00FF66';
    case STATUS_ENUM.PARTIAL: return '#FFD700';
    case STATUS_ENUM.NO: return '#FF3B3B';
    case STATUS_ENUM.NOT_EVALUATED: return '#9ca3af';
    default: return '#374151';
  }
}
