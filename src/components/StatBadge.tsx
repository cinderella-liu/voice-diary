import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export default function StatBadge({ label, value, unit, color }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={[styles.value, { color: color || colors.primary }]}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    minWidth: 80,
  },
  value: {
    fontSize: 22,
    fontFamily: 'ZCOOL-KuaiLe',
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'ZCOOL-KuaiLe',
  },
});
