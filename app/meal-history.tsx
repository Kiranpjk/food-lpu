import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';

export default function MealHistoryScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Meal History</Text>
        <View style={{ width: 44 }} />
      </View>

    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 56,
    backgroundColor: '#2d2c2d',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  backBtn: { padding: 8, borderRadius: 20 },
  title: { fontSize: 18, color: '#ffffff', fontFamily: Font.bold },
  content: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: '#888', fontSize: 14 }
});
