// 记录类型
export type RecordType = 'checkin' | 'exercise' | 'work';

// 工作状态
export type WorkStatus = 'todo' | 'doing' | 'done';

// 考勤元数据
export interface CheckinMeta {
  checkIn?: string;   // HH:mm
  checkOut?: string;  // HH:mm
  duration?: number;  // 分钟
}

// 运动元数据
export interface ExerciseMeta {
  sportType?: string;
  duration?: number;  // 分钟
}

// 工作计划元数据
export interface WorkMeta {
  status: WorkStatus;
}

// 记录
export interface DiaryRecord {
  id: string;
  type: RecordType;
  title: string;
  content: string;
  timestamp: string;   // ISO string
  metadata: CheckinMeta | ExerciseMeta | WorkMeta;
  createdAt: string;   // ISO string
}

// 记录查询过滤
export interface RecordFilter {
  type?: RecordType;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// 统计
export interface MonthlyStats {
  checkin: { avgDuration: number; attendanceDays: number; records: DiaryRecord[] };
  exercise: { totalSessions: number; totalMinutes: number; records: DiaryRecord[] };
  work: { pending: number; completed: number; records: DiaryRecord[] };
}

// 分类结果
export interface CategorizeResult {
  type: RecordType;
  title: string;
  content: string;
}

// 语音状态
export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'error';
