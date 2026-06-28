import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../utils/colors';

interface Props {
  icon?: string;
  message?: string;
}

export default function EmptyState({ icon = 'inbox-outline', message = '暂无记录' }: Props) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={48} color={colors.border} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    fontFamily: 'ZCOOL-KuaiLe',
  },
});
