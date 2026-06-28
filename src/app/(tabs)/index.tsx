import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Alert, TouchableOpacity, Modal, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VoiceButton from '../../components/VoiceButton';
import RecordCard from '../../components/RecordCard';
import EmptyState from '../../components/EmptyState';
import { colors, typeLabels } from '../../utils/colors';
import { useVoice } from '../../hooks/useVoice';
import { useCategorize } from '../../hooks/useCategorize';
import { useRecords } from '../../hooks/useRecords';
import { generateId, addRecord } from '../../utils/storage';
import { DiaryRecord, RecordType } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const typeOptions: { type: RecordType; label: string; icon: string }[] = [
  { type: 'checkin', label: '考勤打卡', icon: 'clock-outline' },
  { type: 'exercise', label: '运动记录', icon: 'run' },
  { type: 'work', label: '工作计划', icon: 'clipboard-text-outline' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const voice = useVoice();
  const cat = useCategorize();
  const { records, refresh } = useRecords();

  const recentRecords = records.slice(0, 5);

  // 语音识别完成 → 自动归类
  useEffect(() => {
    if (voice.status === 'idle' && voice.text) {
      cat.categorizeText(voice.text);
    }
  }, [voice.status, voice.text]);

  // 保存记录
  const saveRecord = async (type: RecordType) => {
    if (!cat.result) return;

    const now = new Date().toISOString();
    let metadata: any = {};

    // 根据类型构建元数据
    switch (type) {
      case 'checkin':
        metadata = {
          checkIn: new Date().toTimeString().slice(0, 5),
          duration: 0,
        };
        break;
      case 'exercise':
        metadata = { sportType: cat.result.title, duration: 0 };
        break;
      case 'work':
        metadata = { status: 'todo' };
        break;
    }

    const record: DiaryRecord = {
      id: generateId(),
      type,
      title: cat.result.title,
      content: cat.result.content,
      timestamp: now,
      metadata,
      createdAt: now,
    };

    await addRecord(record);
    await refresh();
    voice.reset();
    cat.reset();
  };

  // 保存并跳到指定模块
  const handleSaveAndNavigate = async (type: RecordType) => {
    await saveRecord(type);
  };

  const handleMicPress = () => {
    if (voice.status === 'listening') {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>语音记事本</Text>
        <Text style={styles.subtitle}>点击麦克风开始语音记录</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* 语音按钮区域 */}
        <View style={styles.voiceSection}>
          <VoiceButton
            isListening={voice.status === 'listening'}
            onPress={handleMicPress}
          />
          {voice.status === 'listening' && (
            <Text style={styles.listeningHint}>正在聆听...</Text>
          )}
          {voice.status === 'processing' && (
            <Text style={styles.processingHint}>识别中...</Text>
          )}
          {voice.error && (
            <Text style={styles.errorText}>{voice.error}</Text>
          )}
        </View>

        {/* 归类确认弹窗 */}
        <Modal visible={cat.showConfirm} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>识别结果</Text>
              <Text style={styles.modalText}>{cat.result?.content}</Text>
              <Text style={styles.modalHint}>自动归类为：</Text>

              <View style={styles.typeOptions}>
                {typeOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.type}
                    style={[
                      styles.typeOption,
                      cat.result?.type === opt.type && styles.typeOptionActive,
                    ]}
                    onPress={() => cat.confirmType(opt.type)}
                  >
                    <Icon
                      name={opt.icon}
                      size={20}
                      color={cat.result?.type === opt.type ? '#fff' : colors.primary}
                    />
                    <Text
                      style={[
                        styles.typeOptionText,
                        cat.result?.type === opt.type && styles.typeOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => { voice.reset(); cat.reset(); }}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => cat.result && saveRecord(cat.result.type)}
                >
                  <Text style={styles.saveText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 最近记录 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近记录</Text>
        </View>

        {recentRecords.length === 0 ? (
          <EmptyState icon="microphone-outline" message="还没有记录，开始语音输入吧" />
        ) : (
          recentRecords.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  body: {
    flex: 1,
  },
  voiceSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  listeningHint: {
    marginTop: 12,
    fontSize: 14,
    color: colors.accent,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  processingHint: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.danger,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
    marginBottom: 16,
    lineHeight: 22,
  },
  modalHint: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
    marginBottom: 10,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  typeOptionTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ZCOOL-KuaiLe',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
});
