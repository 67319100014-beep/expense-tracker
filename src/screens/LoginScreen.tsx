import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }
    await login(username.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="wallet" size={50} color="#FFF" />
      </View>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>จัดการรายรับ-รายจ่ายของคุณอย่างง่ายดาย</Text>

      <View style={styles.form}>
        <Text style={styles.label}>ชื่อผู้ใช้งาน</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกชื่อผู้ใช้งาน"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>รหัสผ่าน</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกรหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 24 },
  logoBox: { width: 90, height: 90, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16, elevation: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 32, marginTop: 4 },
  form: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 6 },
  input: { backgroundColor: COLORS.background, padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: COLORS.border },
  loginBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});