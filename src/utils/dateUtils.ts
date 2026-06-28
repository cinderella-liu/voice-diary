// 日期工具

/**
 * 格式化时间 ISO → HH:mm
 */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 格式化日期 ISO → MM月DD日
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 格式化日期 ISO → YYYY年MM月
 */
export function formatYearMonth(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

/**
 * 获取当前月份 YYYY-MM
 */
export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

/**
 * 判断日期是否在指定月份
 */
export function isInMonth(iso: string, monthKey: string): boolean {
  return iso.startsWith(monthKey);
}

/**
 * 获取当前年月日 YYYY-MM-DD
 */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 判断日期是否是今天
 */
export function isToday(iso: string): boolean {
  return iso.startsWith(todayKey());
}

/**
 * 分钟 → 小时:分钟
 */
export function minutesToStr(m: number): string {
  if (m < 60) return `${m}分钟`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest > 0 ? `${h}小时${rest}分钟` : `${h}小时`;
}

/**
 * 获取日期的星期几中文
 */
export function getWeekday(iso: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `周${days[new Date(iso).getDay()]}`;
}

/**
 * 短日期 MM/DD
 */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

/**
 * 获取日期在月份中的第几天
 */
export function getDay(iso: string): number {
  return new Date(iso).getDate();
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * 获取月份天数
 */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * N个月前的日期
 */
export function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

// 时间段计算
export function getPeriodRange(period: string): { start: Date; end: Date; label: string } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  switch (period) {
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end,
        label: `${now.getFullYear()}年${now.getMonth() + 1}月`,
      };
    case 'quarter': {
      const q = Math.floor(now.getMonth() / 3);
      const quarterLabels = ['一季度', '二季度', '三季度', '四季度'];
      return {
        start: new Date(now.getFullYear(), q * 3, 1),
        end,
        label: `${now.getFullYear()}年${quarterLabels[q]}`,
      };
    }
    case 'halfYear': {
      const half = now.getMonth() < 6 ? 0 : 6;
      return {
        start: new Date(now.getFullYear(), half, 1),
        end,
        label: `${now.getFullYear()}年${half === 0 ? '上半年' : '下半年'}`,
      };
    }
    case 'year':
    default:
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end,
        label: `${now.getFullYear()}年`,
      };
  }
}
