import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TextInput, TouchableOpacity, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import RecordCard from '../../components/RecordCard';
import EmptyState from '../../components/EmptyState';
import StatBadge from '../../components/StatBadge';
import { colors } from '../../utils/colors';
import { useRecords } from '../../hooks/useRecords';
import { DiaryRecord, WorkStatus } from '../../types';
import { generateId, addRecord, updateRecord, deleteRecord } from '../../utils/storage';

export default function WorkScreen() {
  const insets = useSafeAreaInsets();
  const { records, refresh, getMonthlyStats } = useRecords();
  const [showAdd, setShowAdd] = useState(false);
  const [manualText, setManualText] = useState('');

  const workRecords = useMemo(
    () => records.filter((r) => r.type === 'work'),
    [records]
  );

  const [stats, setStats] = React.useState({ pending: 0, completed: 0 });

  React.useEffect(() => {
    (async () => {
      const s = await getMonthlyStats();
      setStats({ pending: s.work.pending, completed: s.work.completed });
    })();
  }, [records]);

  const handleManualAdd = async () => {
    if (!manualText.trim()) return;
    const now = new Date().toISOString();
    const record: DiaryRecord = {
      id: generateId(),
      type: 'work',
      title: manualText.trim().length > 20
        ? manualText.trim().slice(0, 20) + '...'
        : manualText.trim(),
      content: manualText.trim(),
      timestamp: now,
      metadata: { status: 'todo' },
      createdAt: now,
    };
    await addRecord(record);
    await refresh();
    setManualText('');
    setShowAdd(false);
  };

  const toggleDone = async (record: DiaryRecord) => {
    const currentStatus = (record.metadata as any).status || 'todo';
    const newStatus: WorkStatus = currentStatus === 'done' ? 'todo' : 'done';
    const updated: DiaryRecord = {
      ...record,
      metadata: { ...record.metadata, status: newStatus },
    };
    await updateRecord(updated);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    await refresh();
  };

  const renderRightActions = useCallback((record: DiaryRecord) => {
    return (
      <TouchableOpacity
        style={styles.swipeDone}
        onPress={() => toggleDone(record)}
      >
        <Text style={styles.swipeText}>
          {(record.metadata as any).status === 'done' ? '取消完成' : '标记完成'}
        </Text>
      </TouchableOpacity>
    );
  }, [records]);

  const renderLeftActions = useCallback((id: string) => {
    return (
      <TouchableOpacity
        style={styles.swipeDelete}
        onPress={() => handleDelete(id)}
      >
        <Text style={styles.swipeText}>删除</Text>
      </TouchableOpacity>
    );
  }, [records]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>工作计划</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBadge label="待办事项" value={stats.pending} unit="项" color={colors.accent} />
        <StatBadge label="本月完成" value={stats.completed} unit="项" color={colors.success} />
      </View>

      <FlatList
        data={workRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <RecordCard record={item} />
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="clipboard-text-outline" message="还没有工作计划" />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
        <Text style={styles.addBtnText}>+ 添加任务</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加工作任务</Text>
            <TextInput
              style={styles.input}
              placeholder="输入工作任务..."
              placeholderTextColor={colors.textSecondary}
              value={manualText}
              onChangeText={setManualText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowAdd(false); setManualText(''); }}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleManualAdd}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 24, color: colors.textPrimary, fontFamily: 'ZCOOL-KuaiLe' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { paddingBottom: 80 },
  addBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addBtnText: { color: '#fff', fontSize: 14, fontFamily: 'ZCOOL-KuaiLe' },
  swipeDone: {
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginVertical: 4,
  },
  swipeDelete: {
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginVertical: 4,
  },
  swipeText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: colors.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 360 },
  modalTitle: { fontSize: 18, color: colors.textPrimary, fontFamily: 'ZCOOL-KuaiLe', marginBottom: 12 },
  input: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelText: { fontSize: 14, color: colors.textSecondary, fontFamily: 'ZCOOL-KuaiLe' },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center' },
  saveText: { fontSize: 14, color: '#fff', fontFamily: 'ZCOOL-KuaiLe' },
});
