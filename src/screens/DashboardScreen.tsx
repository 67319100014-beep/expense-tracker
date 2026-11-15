import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }: any) => {
  const { transactions, totalBalance, totalIncome, totalExpense } = useApp();

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>ยอดเงินคงเหลือ</Text>
        <Text style={styles.balanceAmount}>฿{totalBalance.toLocaleString()}</Text>
        <View style={styles.row}>
          <View style={styles.statsBox}>
            <Text style={styles.incomeText}>↑ รายรับ</Text>
            <Text style={styles.statsAmount}>฿{totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.expenseText}>↓ รายจ่าย</Text>
            <Text style={styles.statsAmount}>฿{totalExpense.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Recent Transactions List */}
      <Text style={styles.sectionTitle}>รายการล่าสุด</Text>
      <FlatList
        data={transactions.slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <View>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txDate}>{new Date(item.timestamp).toLocaleDateString('th-TH')}</Text>
            </View>
            <Text style={[styles.txAmount, { color: item.type === 'income' ? COLORS.income : COLORS.expense }]}>
              {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีรายการธุรกรรม</Text>}
      />

      {/* FAB Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  balanceCard: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 16, marginBottom: 20 },
  balanceTitle: { color: '#E8F8F5', fontSize: 14 },
  balanceAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statsBox: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 8, width: '48%' },
  incomeText: { color: '#A7F3D0', fontWeight: 'bold' },
  expenseText: { color: '#FECACA', fontWeight: 'bold' },
  statsAmount: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 12 },
  txItem: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  txTitle: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
  txDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 30 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});