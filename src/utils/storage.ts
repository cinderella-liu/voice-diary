import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryRecord, RecordFilter } from '../types';

const STORAGE_KEY = 'voice_diary_records';

/**
 * 获取所有记录
 */
export async function getAllRecords(): Promise<DiaryRecord[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  return JSON.parse(json);
}

/**
 * 保存所有记录
 */
export async function saveAllRecords(records: DiaryRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * 添加一条记录
 */
export async function addRecord(record: DiaryRecord): Promise<void> {
  const records = await getAllRecords();
  records.unshift(record); // 最新在前
  await saveAllRecords(records);
}

/**
 * 更新一条记录
 */
export async function updateRecord(updated: DiaryRecord): Promise<void> {
  const records = await getAllRecords();
  const idx = records.findIndex((r) => r.id === updated.id);
  if (idx !== -1) {
    records[idx] = updated;
    await saveAllRecords(records);
  }
}

/**
 * 删除一条记录
 */
export async function deleteRecord(id: string): Promise<void> {
  const records = await getAllRecords();
  await saveAllRecords(records.filter((r) => r.id !== id));
}

/**
 * 按条件查询记录
 */
export async function queryRecords(filter: RecordFilter): Promise<DiaryRecord[]> {
  let records = await getAllRecords();

  if (filter.type) {
    records = records.filter((r) => r.type === filter.type);
  }

  if (filter.startDate) {
    const start = new Date(filter.startDate).getTime();
    records = records.filter((r) => new Date(r.timestamp).getTime() >= start);
  }

  if (filter.endDate) {
    const end = new Date(filter.endDate).getTime();
    records = records.filter((r) => new Date(r.timestamp).getTime() <= end);
  }

  if (filter.limit) {
    records = records.slice(0, filter.limit);
  }

  return records;
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
