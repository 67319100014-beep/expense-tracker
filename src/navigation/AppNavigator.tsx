import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'wallet-outline';
          if (route.name === 'Dashboard') iconName = 'wallet-outline';
          else if (route.name === 'History') iconName = 'list-outline';
          else if (route.name === 'Summary') iconName = 'pie-chart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#FFF',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'หน้าหลัก' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'ประวัติ' }} />
      <Tab.Screen name="Summary" component={SummaryScreen} options={{ title: 'สรุปการเงิน' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { userEmail } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#FFF',
      }}
    >
      {userEmail == null ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'เพิ่มรายการธุรกรรม' }} />
        </>
      )}
    </Stack.Navigator>
  );
}