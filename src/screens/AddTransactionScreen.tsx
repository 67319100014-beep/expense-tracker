import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const CATEGORIES = ['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บิล/ค่าน้ำไฟ', 'เงินเดือน', 'ทั่วไป'];

export const AddTransactionScreen = ({ navigation }: any) => {
  const { addTransaction } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('อาหาร');

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('กรุณากรอกข้อมูล', 'ระบุชื่อรายการและจำนวนเงินให้ครบถ้วน');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('จำนวนเงินไม่ถูกต้อง', 'กรุณากรอกตัวเลขที่มากกว่า 0');
      return;
    }

    await addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* เลือกประเภท รายจ่าย / รายรับ */}
      <View style={styles.typeContainer}>
        <TouchableOpacity 
          style={[styles.typeBtn, type === 'expense' && { backgroundColor: COLORS.expense }]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeText, type === 'expense' && { color: '#FFF' }]}>รายจ่าย</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeBtn, type === 'income' && { backgroundColor: COLORS.income }]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeText, type === 'income' && { color: '#FFF' }]}>รายรับ</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>ชื่อรายการ</Text>
      <TextInput
        style={styles.input}
        placeholder="เช่น ค่าอาหารกลางวัน, เงินเดือน"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>จำนวนเงิน (บาท)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>หมวดหมู่</Text>
      <View style={styles.categoryWrap}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, category === cat && styles.catChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>บันทึกรายการ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  typeContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 10, backgroundColor: COLORS.border, padding: 4 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  typeText: { fontWeight: 'bold', color: COLORS.textSecondary },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  input: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: COLORS.border },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  catChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { color: COLORS.textSecondary, fontSize: 14 },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});