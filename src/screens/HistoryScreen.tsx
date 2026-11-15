import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const HistoryScreen = () => {
  const { transactions, deleteTransaction } = useApp();

  const handleDelete = (id: string, title: string) => {
    Alert.alert('ยืนยันการลบ', `ต้องการลบรายการ "${title}" ใช่หรือไม่?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบรายการ', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const dateObj = new Date(item.timestamp);
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>[{item.category}]</Text>
                <Text style={styles.time}>{dateObj.toLocaleDateString('th-TH')} {dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.amount, { color: item.type === 'income' ? COLORS.income : COLORS.expense }]}>
                  {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString()}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.title)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>ไม่มีประวัติการทำรายการ</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, elevation: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  category: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  time: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { marginTop: 8, padding: 4 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40 },
});