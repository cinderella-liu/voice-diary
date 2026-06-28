import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DiaryRecord } from '../types';
import { colors, typeLabels, typeIcons, workStatusLabels } from '../utils/colors';
import { formatTime, formatDate, minutesToStr, getWeekday } from '../utils/dateUtils';

interface Props {
  record: DiaryRecord;
  onPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function RecordCard({ record, onPress }: Props) {
  const meta = record.metadata as any;
  const iconName = typeIcons[record.type];

  const renderMeta = () => {
    switch (record.type) {
      case 'checkin':
        return (
          <Text style={styles.metaText}>
            {meta.checkIn && `上班 ${meta.checkIn}`}
            {meta.checkOut && `  下班 ${meta.checkOut}`}
            {meta.duration != null && `  ·  ${minutesToStr(meta.duration)}`}
          </Text>
        );
      case 'exercise':
        return (
          <Text style={styles.metaText}>
            {meta.sportType && `${meta.sportType}`}
            {meta.duration != null && `  ·  ${minutesToStr(meta.duration)}`}
          </Text>
        );
      case 'work':
        return (
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: meta.status === 'done' ? colors.success : meta.status === 'doing' ? colors.accent : colors.border }]}>
              <Text style={[styles.statusText, { color: meta.status === 'done' ? '#fff' : colors.textPrimary }]}>
                {workStatusLabels[meta.status || 'todo']}
              </Text>
            </View>
            <Text style={styles.metaText} numberOfLines={2}>{record.content}</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <Icon name={iconName} size={16} color={colors.primary} />
          <Text style={styles.typeLabel}>{typeLabels[record.type]}</Text>
        </View>
        <Text style={styles.dateText}>
          {formatDate(record.timestamp)} {getWeekday(record.timestamp)}
        </Text>
      </View>
      <Text style={styles.title}>{record.title}</Text>
      {renderMeta()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'ZCOOL-KuaiLe',
  },
});
