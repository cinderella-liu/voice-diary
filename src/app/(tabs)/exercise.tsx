import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TextInput, TouchableOpacity, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecordCard from '../../components/RecordCard';
import EmptyState from '../../components/EmptyState';
import StatBadge from '../../components/StatBadge';
import { colors } from '../../utils/colors';
import { useRecords } from '../../hooks/useRecords';
import { DiaryRecord } from '../../types';
import { generateId, addRecord } from '../../utils/storage';
import { minutesToStr } from '../../utils/dateUtils';

export default function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const { records, refresh, getMonthlyStats } = useRecords();
  const [showAdd, setShowAdd] = useState(false);
  const [manualText, setManualText] = useState('');

  const exerciseRecords = useMemo(
    () => records.filter((r) => r.type === 'exercise'),
    [records]
  );

  const [stats, setStats] = React.useState({ totalSessions: 0, totalMinutes: 0 });

  React.useEffect(() => {
    (async () => {
      const s = await getMonthlyStats();
      setStats({ totalSessions: s.exercise.totalSessions, totalMinutes: s.exercise.totalMinutes });
    })();
  }, [records]);

  const handleManualAdd = async () => {
    if (!manualText.trim()) return;
    const now = new Date().toISOString();
    const record: DiaryRecord = {
      id: generateId(),
      type: 'exercise',
      title: '运动记录',
      content: manualText.trim(),
      timestamp: now,
      metadata: { sportType: '', duration: 0 },
      createdAt: now,
    };
    await addRecord(record);
    await refresh();
    setManualText('');
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>运动记录</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBadge label="本月运动" value={stats.totalSessions} unit="次" color={colors.primary} />
        <StatBadge label="总时长" value={minutesToStr(stats.totalMinutes)} color={colors.accent} />
      </View>

      <FlatList
        data={exerciseRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard record={item} />}
        ListEmptyComponent={<EmptyState icon="run" message="还没有运动记录" />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
        <Text style={styles.addBtnText}>+ 手动添加</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加运动记录</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：跑步5公里，用时30分钟"
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
