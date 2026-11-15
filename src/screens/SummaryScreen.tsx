import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

type Period = 'day' | 'week' | 'month' | 'year';

export const SummaryScreen = () => {
  const { transactions } = useApp();
  const [period, setPeriod] = useState<Period>('month');

  const filtered = transactions.filter((t) => {
    const txDate = new Date(t.timestamp);
    const now = new Date();
    if (period === 'day') return txDate.toDateString() === now.toDateString();
    if (period === 'month') return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    if (period === 'year') return txDate.getFullYear() === now.getFullYear();
    if (period === 'week') {
      const diffTime = Math.abs(now.getTime() - txDate.getTime());
      return diffTime / (1000 * 60 * 60 * 24) <= 7;
    }
    return true;
  });

  const incomeSum = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseSum = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.tab, period === p && styles.activeTab]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.tabText, period === p && styles.activeTabText]}>
              {p === 'day' ? 'วัน' : p === 'week' ? 'สัปดาห์' : p === 'month' ? 'เดือน' : 'ปี'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* สรุปตัวเลข */}
      <View style={styles.summaryBox}>
        <Text style={styles.boxTitle}>สรุปยอดเงิน ({period.toUpperCase()})</Text>
        <View style={styles.row}>
          <Text style={styles.label}>รายรับทั้งหมด:</Text>
          <Text style={[styles.val, { color: COLORS.income }]}>+฿{incomeSum.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>รายจ่ายทั้งหมด:</Text>
          <Text style={[styles.val, { color: COLORS.expense }]}>-฿{expenseSum.toLocaleString()}</Text>
        </View>
        <View style={[styles.row, { borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 10 }]}>
          <Text style={styles.labelBold}>คงเหลือสุทธิ:</Text>
          <Text style={styles.valBold}>฿{(incomeSum - expenseSum).toLocaleString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.border, borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.textSecondary, fontWeight: 'bold' },
  activeTabText: { color: '#FFF' },
  summaryBox: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 16 },
  boxTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, color: COLORS.textSecondary },
  val: { fontSize: 16, fontWeight: 'bold' },
  labelBold: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  valBold: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});