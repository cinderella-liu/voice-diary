// 复古色系
export const colors = {
  bg: '#F5F0E8',          // 主背景 - 米白
  card: '#FAF6EF',        // 卡片 - 暖白
  primary: '#8B6F47',     // 主色 - 暖棕
  secondary: '#A8B5A0',   // 辅色 - 灰绿
  accent: '#C17F4E',      // 强调 - 陶土橙
  textPrimary: '#3D3229', // 文字主 - 深棕
  textSecondary: '#8B7D6B', // 文字次 - 灰棕
  border: '#E8E0D0',      // 边框 - 浅米
  danger: '#C1554E',      // 危险 - 陶土红
  success: '#7DA87D',     // 成功 - 灰绿
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(61, 50, 41, 0.4)',
};

// 记录类型 → 中文标签
export const typeLabels: Record<string, string> = {
  checkin: '考勤',
  exercise: '运动',
  work: '工作计划',
  life: '生活',
};

// 记录类型 → 图标
export const typeIcons: Record<string, string> = {
  checkin: 'clock-outline',
  exercise: 'run',
  work: 'clipboard-text-outline',
  life: 'heart-outline',
};

// 工作状态 → 中文标签
export const workStatusLabels: Record<string, string> = {
  todo: '待办',
  doing: '进行中',
  done: '已完成',
};

// 季度映射
export const quarterLabels = ['一季度', '二季度', '三季度', '四季度'];

export const periodOptions = [
  { label: '月度', value: 'month' },
  { label: '季度', value: 'quarter' },
  { label: '半年度', value: 'halfYear' },
  { label: '年度', value: 'year' },
] as const;
