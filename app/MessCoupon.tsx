import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';

// Static demo data – replace with real user profile data when available
const PROFILE = {
  name: 'Pybogula Jaya Kiran',
  father: 'Pybogula Appa Rao  (+91 9876543210)',
  mother: 'Pybogula Lakshmi  (+91 9123456780)',
  program: 'B.Tech CSE (AI & ML)  5th Sem  (ID: 12345678)',
  hostel: 'BH - 5 (Block A)  Room 210',
  warning: 'Your hostel confirmation and mess allocation is still pending. Please contact the warden desk to avoid disruption in meals.'
};

export default function MessCouponScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>      
      {/* Custom Header with gradient up to the top */}
      <LinearGradient colors={["#FF8C3A", "#FFC38A", "#FFE8D6"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mess Coupon</Text>
          <TouchableOpacity onPress={() => router.push('/meal-history')} accessibilityRole="button" accessibilityLabel="Meal history">
            <Text style={styles.historyLink}>Meal History</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile / Gradient Card */}
        <LinearGradient colors={["#FF8C3A", "#FFC38A", "#FFE8D6"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.gradientCard}>
          <View style={styles.avatarWrapper}>            
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=P+J+K&background=FF8C3A&color=fff' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{PROFILE.name}</Text>

          <View style={styles.infoList}>
            <InfoItem label="Father's Name" value={PROFILE.father} />
            <InfoItem label="Mother's Name" value={PROFILE.mother} />
            <InfoItem label="Program Name" value={PROFILE.program} />
            <InfoItem label="Hostel" value={PROFILE.hostel} />
          </View>

          <View style={styles.warningBox} accessibilityLiveRegion="polite">
            <Text style={styles.warningText}>{PROFILE.warning}</Text>
          </View>
        </LinearGradient>

        {/* Call to Action / Instruction Section */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaText}>Tap on the meal name to scan and avail food.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>      
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0' // Universal grey safe area
  },
  headerGradient: {
    height: 60,
  },
  headerRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  headerIcon: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: '#1a1a1a'
  },
  historyLink: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: '#FF8C3A'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  gradientCard: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 70,
    paddingBottom: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    position: 'relative'
  },
  avatarWrapper: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#FF8C3A'
  },
  name: {
    fontSize: 20,
    fontFamily: Font.bold,
    textAlign: 'center',
    color: '#2d2d2d',
    marginBottom: 16
  },
  infoList: {
    gap: 14,
    marginBottom: 18
  },
  infoItem: {},
  infoLabel: {
    fontSize: 11,
    color: '#4d4d4d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: '#1f1f1f',
    lineHeight: 18
  },
  warningBox: {
    marginTop: 4
  },
  warningText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#C62828',
    fontFamily: Font.bold
  },
  ctaCard: {
    backgroundColor: '#ececec',
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
    borderColor: '#d5d5d5',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 140
  },
  ctaText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Font.bold,
    color: '#333'
  }
});
