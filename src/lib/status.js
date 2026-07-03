export function getStatusLabel(status) {
  switch (status) {
    case 'beli':    return 'Bəli';
    case 'qismen':  return 'Qismən';
    case 'xeyr':    return 'Xeyr';
    case 'nt':      return 'N/T';
    default:        return 'Qiymətləndirilməyib';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'beli':   return '#00FF66';
    case 'qismen': return '#FFD700';
    case 'xeyr':   return '#FF3B3B';
    case 'nt':     return '#9ca3af';
    default:       return '#374151';
  }
}
