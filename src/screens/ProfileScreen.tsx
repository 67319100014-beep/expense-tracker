import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
  const { transactions, totalBalance, userEmail, logout } = useApp();

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ออกจากระบบ', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      
      <Text style={styles.name}>{userEmail || 'ผู้ใช้งาน'}</Text>
      <Text style={styles.email}>สมาชิก Expense Tracker</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>จำนวนรายการที่บันทึกทั้งหมด</Text>
          <Text style={styles.infoValue}>{transactions.length} รายการ</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <Text style={styles.infoLabel}>ยอดเงินคงเหลือสุทธิ</Text>
          <Text style={[styles.infoValue, { color: COLORS.primary }]}>฿{totalBalance.toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FFF" />
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.mintLight, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 40 },
  name: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
  email: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 30, marginTop: 4 },
  infoCard: { width: '100%', backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, elevation: 1, marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  logoutBtn: { width: '100%', backgroundColor: COLORS.expense, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});