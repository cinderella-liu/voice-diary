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

const LIFE_CATEGORIES = ['美食', '购物', '旅行', '日常', '娱乐', '其他'];

export default function LifeScreen() {
  const insets = useSafeAreaInsets();
  const { records, refresh, getMonthlyStats } = useRecords();
  const [showAdd, setShowAdd] = useState(false);
  const [manualText, setManualText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('日常');

  const lifeRecords = useMemo(
    () => records.filter((r) => r.type === 'life'),
    [records]
  );

  const [stats, setStats] = useState({ totalRecords: 0, topCategory: '' });

  React.useEffect(() => {
    (async () => {
      const s = await getMonthlyStats();
      const cats = s.life.categories;
      const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
      setStats({
        totalRecords: s.life.totalRecords,
        topCategory: top ? `${top[0]} ${top[1]}次` : '暂无',
      });
    })();
  }, [records]);

  const handleManualAdd = async () => {
    if (!manualText.trim()) return;
    const now = new Date().toISOString();
    const record: DiaryRecord = {
      id: generateId(),
      type: 'life',
      title: selectedCategory,
      content: manualText.trim(),
      timestamp: now,
      metadata: { category: selectedCategory },
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
        <Text style={styles.title}>生活记录</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBadge label="本月记录" value={stats.totalRecords} unit="条" color={colors.primary} />
        <StatBadge label="最多类别" value={stats.topCategory} color={colors.accent} />
      </View>

      <FlatList
        data={lifeRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard record={item} />}
        ListEmptyComponent={<EmptyState icon="heart-outline" message="还没有生活记录" />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
        <Text style={styles.addBtnText}>+ 记录生活</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>记录生活</Text>

            {/* 分类选择 */}
            <View style={styles.categoryRow}>
              {LIFE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="今天发生了什么？"
              placeholderTextColor={colors.textSecondary}
              value={manualText}
              onChangeText={setManualText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setShowAdd(false); setManualText(''); }}
              >
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  categoryTextActive: {
    color: '#fff',
  },
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
