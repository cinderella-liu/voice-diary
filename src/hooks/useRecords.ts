import { useState, useEffect, useCallback } from 'react';
import { DiaryRecord, RecordFilter, MonthlyStats } from '../types';
import { getAllRecords, addRecord, updateRecord, deleteRecord } from '../utils/storage';
import { currentMonthKey, isInMonth } from '../utils/dateUtils';

export function useRecords() {
  const [records, setRecords] = useState<DiaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (record: DiaryRecord) => {
    await addRecord(record);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (record: DiaryRecord) => {
    await updateRecord(record);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await deleteRecord(id);
    await refresh();
  }, [refresh]);

  const query = useCallback(async (filter: RecordFilter): Promise<DiaryRecord[]> => {
    let result = [...records];
    if (filter.type) result = result.filter(r => r.type === filter.type);
    if (filter.startDate) {
      const s = new Date(filter.startDate).getTime();
      result = result.filter(r => new Date(r.timestamp).getTime() >= s);
    }
    if (filter.endDate) {
      const e = new Date(filter.endDate).getTime();
      result = result.filter(r => new Date(r.timestamp).getTime() <= e);
    }
    if (filter.limit) result = result.slice(0, filter.limit);
    return result;
  }, [records]);

  const getMonthlyStats = useCallback(async (monthKey?: string): Promise<MonthlyStats> => {
    const mk = monthKey || currentMonthKey();
    const monthRecords = records.filter(r => isInMonth(r.timestamp, mk));

    const checkins = monthRecords.filter(r => r.type === 'checkin');
    const exercises = monthRecords.filter(r => r.type === 'exercise');
    const works = monthRecords.filter(r => r.type === 'work');
    const lives = monthRecords.filter(r => r.type === 'life');

    // 统计生活类别分布
    const lifeCategories: Record<string, number> = {};
    lives.forEach(r => {
      const cat = (r.metadata as any).category || '其他';
      lifeCategories[cat] = (lifeCategories[cat] || 0) + 1;
    });

    return {
      checkin: {
        avgDuration: checkins.length > 0
          ? Math.round(checkins.reduce((s, r) => s + ((r.metadata as any).duration || 0), 0) / checkins.length)
          : 0,
        attendanceDays: checkins.length,
        records: checkins,
      },
      exercise: {
        totalSessions: exercises.length,
        totalMinutes: exercises.reduce((s, r) => s + ((r.metadata as any).duration || 0), 0),
        records: exercises,
      },
      work: {
        pending: works.filter(r => (r.metadata as any).status !== 'done').length,
        completed: works.filter(r => (r.metadata as any).status === 'done').length,
        records: works,
      },
      life: {
        totalRecords: lives.length,
        categories: lifeCategories,
        records: lives,
      },
    };
  }, [records]);

  return { records, loading, refresh, add, update, remove, query, getMonthlyStats };
}
