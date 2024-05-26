import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Nhập locale tiếng Việt

export function formatDate(date?: Date, format: string = 'DD/MM/YYYY'): string {
  if (!date) return '';
  return dayjs(date).locale('vi').format(format);
}
