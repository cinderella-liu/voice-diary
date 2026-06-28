import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Dimensions, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { colors, periodOptions } from '../../utils/colors';
import { useRecords } from '../../hooks/useRecords';
import { DiaryRecord } from '../../types';
import { getPeriodRange, shortDate, getDay, daysInMonth } from '../../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;
const chartConfig = {
  backgroundColor: colors.card,
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(139, 111, 71, ${opacity})`,
  labelColor: () => colors.textSecondary,
  style: { borderRadius: 12 },
  propsForDots: { r: '4', strokeWidth: '1.5', stroke: colors.accent },
  propsForLabels: { fontFamily: 'ZCOOL-KuaiLe', fontSize: 10 },
};

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { records } = useRecords();
  const [period, setPeriod] = useState('month');

  const range = getPeriodRange(period);

  const filteredRecords = useMemo(() => {
    const start = range.start.getTime();
    const end = range.end.getTime();
    return records.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= start && t <= end;
    });
  }, [records, period]);

  // --- 考勤折线图（每日工时） ---
  const checkinChart = useMemo(() => {
    const checkins = filteredRecords.filter((r) => r.type === 'checkin');

    if (period === 'month') {
      const days = daysInMonth(range.start.getFullYear(), range.start.getMonth() + 1);
      const labels: string[] = [];
      const data: number[] = [];

      let labelStep = 1;
      if (days > 20) labelStep = 5;
      else if (days > 10) labelStep = 3;

      for (let d = 1; d <= days; d++) {
        const dayStr = `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayRecords = checkins.filter((r) => r.timestamp.startsWith(dayStr));
        const totalMin = dayRecords.reduce((s, r) => s + ((r.metadata as any).duration || 0), 0);
        data.push(Math.round(totalMin / 60 * 10) / 10);

        if (d === 1 || d % labelStep === 0 || d === days) {
          labels.push(String(d) + '日');
        } else {
          labels.push('');
        }
      }

      return {
        labels: labels.length > 0 ? labels : ['1日'],
        datasets: [{ data: data.length > 0 ? data : [0] }],
      };
    }

    // 季度/半年/年度 - 按月聚合
    const startMonth = range.start.getMonth();
    const endMonth = range.end.getMonth();
    const months = endMonth - startMonth + 1;
    const labels: string[] = [];
    const data: number[] = [];

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    for (let i = 0; i < months; i++) {
      const m = startMonth + i;
      labels.push(monthNames[m]);
      const monthRecords = checkins.filter((r) => {
        const d = new Date(r.timestamp);
        return d.getMonth() === m;
      });
      const totalMin = monthRecords.reduce((s, r) => s + ((r.metadata as any).duration || 0), 0);
      data.push(Math.round(totalMin / 60 * 10) / 10);
    }

    return {
      labels: labels.length > 0 ? labels : ['本月'],
      datasets: [{ data: data.length > 0 ? data : [0] }],
    };
  }, [filteredRecords, period]);

  // --- 运动柱状图 ---
  const exerciseChart = useMemo(() => {
    const exercises = filteredRecords.filter((r) => r.type === 'exercise');

    if (period === 'month') {
      const days = daysInMonth(range.start.getFullYear(), range.start.getMonth() + 1);
      const labels: string[] = [];
      const data: number[] = [];

      let labelStep = 1;
      if (days > 20) labelStep = 5;
      else if (days > 10) labelStep = 3;

      for (let d = 1; d <= days; d++) {
        const dayStr = `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const count = exercises.filter((r) => r.timestamp.startsWith(dayStr)).length;
        data.push(count);
        if (d === 1 || d % labelStep === 0 || d === days) {
          labels.push(String(d) + '日');
        } else {
          labels.push('');
        }
      }

      return {
        labels: labels.length > 0 ? labels : ['1日'],
        datasets: [{ data: data.length > 0 ? data : [0] }],
      };
    }

    const startMonth = range.start.getMonth();
    const endMonth = range.end.getMonth();
    const months = endMonth - startMonth + 1;
    const labels: string[] = [];
    const data: number[] = [];
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    for (let i = 0; i < months; i++) {
      const m = startMonth + i;
      labels.push(monthNames[m]);
      data.push(exercises.filter((r) => new Date(r.timestamp).getMonth() === m).length);
    }

    return {
      labels: labels.length > 0 ? labels : ['本月'],
      datasets: [{ data: data.length > 0 ? data : [0] }],
    };
  }, [filteredRecords, period]);

  // --- 工作计划饼图 ---
  const workChart = useMemo(() => {
    const works = filteredRecords.filter((r) => r.type === 'work');
    const done = works.filter((r) => (r.metadata as any).status === 'done').length;
    const pending = works.filter((r) => (r.metadata as any).status !== 'done').length;

    if (done === 0 && pending === 0) return [];

    return [
      {
        name: '已完成',
        population: done,
        color: colors.success,
        legendFontColor: colors.textPrimary,
        legendFontSize: 12,
      },
      {
        name: '待完成',
        population: pending,
        color: colors.accent,
        legendFontColor: colors.textPrimary,
        legendFontSize: 12,
      },
    ];
  }, [filteredRecords]);

  // --- 生活类别分布柱状图 ---
  const lifeChart = useMemo(() => {
    const lives = filteredRecords.filter((r) => r.type === 'life');

    if (lives.length === 0) return null;

    const catCount: Record<string, number> = {};
    lives.forEach((r) => {
      const cat = (r.metadata as any).category || '其他';
      catCount[cat] = (catCount[cat] || 0) + 1;
    });

    const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([c]) => c),
      datasets: [{ data: sorted.map(([, v]) => v) }],
    };
  }, [filteredRecords]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>数据分析</Text>
        <Text style={styles.subtitle}>{range.label}</Text>
      </View>

      {/* 时间段切换 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodBar}>
        {periodOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.periodBtn, period === opt.value && styles.periodBtnActive]}
            onPress={() => setPeriod(opt.value)}
          >
            <Text style={[styles.periodText, period === opt.value && styles.periodTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* 考勤趋势 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📋 考勤工时趋势</Text>
          {checkinChart.datasets[0].data.some((v) => v > 0) ? (
            <LineChart
              data={checkinChart}
              width={screenWidth - 48}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
            />
          ) : (
            <Text style={styles.noData}>暂无考勤数据</Text>
          )}
        </View>

        {/* 运动统计 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🏃 运动频次统计</Text>
          {exerciseChart.datasets[0].data.some((v) => v > 0) ? (
            <BarChart
              data={exerciseChart}
              width={screenWidth - 48}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />
          ) : (
            <Text style={styles.noData}>暂无运动数据</Text>
          )}
        </View>

        {/* 工作计划完成率 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📝 工作计划完成率</Text>
          {workChart.length > 0 ? (
            <PieChart
              data={workChart}
              width={screenWidth - 48}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text style={styles.noData}>暂无工作数据</Text>
          )}
        </View>

        {/* 生活类别分布 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>❤️ 生活类别分布</Text>
          {lifeChart ? (
            <BarChart
              data={lifeChart}
              width={screenWidth - 48}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />
          ) : (
            <Text style={styles.noData}>暂无生活记录</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 24, color: colors.textPrimary, fontFamily: 'ZCOOL-KuaiLe' },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, fontFamily: 'ZCOOL-KuaiLe' },
  periodBar: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  periodBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
  },
  periodTextActive: {
    color: '#fff',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'ZCOOL-KuaiLe',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  noData: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'ZCOOL-KuaiLe',
    paddingVertical: 40,
  },
});
