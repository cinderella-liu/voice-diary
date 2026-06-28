import { RecordType, CategorizeResult } from '../types';

// 考勤关键词
const checkinKeywords = [
  '上班', '下班', '打卡', '签到', '到岗', '离岗',
  '到公司', '回家', '出门', '到班', '下班打卡',
  '上班打卡', '早到', '迟到', '早退', '加班',
  '下班了', '上班了', '到公司了', '回家了',
];

// 运动关键词
const exerciseKeywords = [
  '运动', '跑步', '健身', '游泳', '攀岩', '瑜伽',
  '跑步机', '俯卧撑', '深蹲', '举铁', '有氧',
  '骑行', '打球', '篮球', '足球', '羽毛球',
  '跳绳', '散步', '快走', '拉伸', '引体向上',
  '卧推', '硬拉', '椭圆机', '动感单车', '撸铁',
  '跑完了', '跑了', '游了', '练了',
];

/**
 * 根据文本自动归类
 */
export function categorize(text: string): CategorizeResult {
  const t = text.trim();

  // 检查考勤关键词
  for (const kw of checkinKeywords) {
    if (t.includes(kw)) {
      return {
        type: 'checkin',
        title: extractCheckinTitle(t),
        content: t,
      };
    }
  }

  // 检查运动关键词
  for (const kw of exerciseKeywords) {
    if (t.includes(kw)) {
      return {
        type: 'exercise',
        title: extractExerciseTitle(t),
        content: t,
      };
    }
  }

  // 默认：工作计划
  return {
    type: 'work',
    title: t.length > 20 ? t.slice(0, 20) + '...' : t,
    content: t,
  };
}

function extractCheckinTitle(text: string): string {
  if (text.includes('上班')) return '上班打卡';
  if (text.includes('下班')) return '下班打卡';
  if (text.includes('到岗') || text.includes('到公司')) return '到岗';
  if (text.includes('离岗') || text.includes('回家')) return '离岗';
  if (text.includes('打卡') || text.includes('签到')) return '打卡签到';
  if (text.includes('加班')) return '加班';
  return '考勤记录';
}

function extractExerciseTitle(text: string): string {
  if (text.includes('跑步')) return '跑步';
  if (text.includes('健身')) return '健身';
  if (text.includes('游泳')) return '游泳';
  if (text.includes('攀岩')) return '攀岩';
  if (text.includes('瑜伽')) return '瑜伽';
  if (text.includes('骑行')) return '骑行';
  if (text.includes('打球') || text.includes('篮球')) return '篮球';
  if (text.includes('羽毛球')) return '羽毛球';
  if (text.includes('跳绳')) return '跳绳';
  if (text.includes('散步') || text.includes('快走')) return '散步';
  return '运动记录';
}

/**
 * 手动指定归类
 */
export function getDefaultTitle(type: RecordType): string {
  switch (type) {
    case 'checkin': return '考勤记录';
    case 'exercise': return '运动记录';
    case 'work': return '工作任务';
  }
}
