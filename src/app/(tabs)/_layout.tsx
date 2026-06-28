import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../utils/colors';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Icon
      name={name}
      size={22}
      color={focused ? colors.primary : colors.textSecondary}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'ZCOOL-KuaiLe',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: '语音',
          tabBarIcon: ({ focused }) => <TabIcon name="microphone" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          tabBarLabel: '考勤',
          tabBarIcon: ({ focused }) => <TabIcon name="clock-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="exercise"
        options={{
          tabBarLabel: '运动',
          tabBarIcon: ({ focused }) => <TabIcon name="run" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="work"
        options={{
          tabBarLabel: '工作',
          tabBarIcon: ({ focused }) => <TabIcon name="clipboard-text-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarLabel: '分析',
          tabBarIcon: ({ focused }) => <TabIcon name="chart-bar" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
