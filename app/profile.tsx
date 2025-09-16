import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';

const MOCK = {
  name: 'Pybogula Jaya Kiran',
  program: 'P13AF-L:B.Tech. (Robotics and Automation) [Lateral Entry][2023]',
  regNo: '12305441',
  avatar: require('../assets/images/photo.jpg'),
  basic: {
    father: 'Pybogula Somanna',
    mother: 'Pybogula Laksmi',
    permanentAddress: '97-549-e 4th Street, Hyderabad, Andhra Pradesh,India, 500001',
    correspondenceAddress: '97-549-e 4th Street, Hyderabad, Andhra Pradesh,India, 500001',
    contact: '+91 98765 43210',
    email: 'unknown@gmail.com',
    dob: '01 Dec 2005',
    gender: 'Male',
  },
  academic: {
    program: 'P132-L-B.tech. (Robotics and Automation) [Lateral Entry]',
    admission: '2022-1',
    session: '2022-2026',
    batch: '2022',
    section: 'K22F1',
    tpc: '1794:Jaspret Singh (0u9875689708)',
  },
  hostel: {
    hostel: 'BH - 3 (Block A), Room 210',
    warden: '2456:Mr. Sharma (+91 90000 11111)'
  }
};

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={['top','bottom']}>
      {/* Header with grey background, white text, back arrow and QR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44, alignItems: 'flex-end' }}>
          <View style={styles.qrBox}>
            {/* <Ionicons name="qr-code-outline" size={22} color="#fff" /> */}
            <Text style={{ color: '#fff', fontSize: 17 }}>(QR)</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Gradient profile header inside the unified card */}
          <LinearGradient colors={["#e47668", "#e59769", "#ffdb79"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.profileHeader}>
            <Image source={MOCK.avatar} style={styles.avatar} />
            <Text style={styles.name}>{MOCK.name}</Text>
            <Text style={styles.program}>{MOCK.program}</Text>
            {/* <Text style={styles.reg}>Reg No: {MOCK.regNo}</Text> */}
          </LinearGradient>

          {/* Basic Section */}
          <Section title="Basic"        >
            <Field label="Father's Name" value={MOCK.basic.father} />
            <Field label="Mother's Name" value={MOCK.basic.mother} />
            <Field label="Permanent Address" value={MOCK.basic.permanentAddress} />
            <Field label="Correspondence Address" value={MOCK.basic.correspondenceAddress} />
            <Field label="Contact No" value={MOCK.basic.contact} />
            <Field label="Email" value={MOCK.basic.email} />
            <Field label="Date of Birth" value={MOCK.basic.dob} />
            <Field label="Gender" value={MOCK.basic.gender} />
          </Section>

          {/* Academic Details */}
          <Section title="Academic Details">
            <Field label="Program" value={MOCK.academic.program} />
            <Field label="Admission" value={MOCK.academic.admission} />
            <Field label="Session" value={MOCK.academic.session} />
            <Field label="Batch" value={MOCK.academic.batch} />
            <Field label="Section" value={MOCK.academic.section} />
            <Field label="TPC" value={MOCK.academic.tpc} />
          </Section>

          {/* Hostel Details */}
          <Section title="Hostel Details">
            <Field label="Hostel" value={MOCK.hostel.hostel} />
            <Field label="Warden" value={MOCK.hostel.warden} />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>
        {children}
      </View>
    </View>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: 60,
    backgroundColor: '#2d2c2d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerBtn: { padding: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontFamily: Font.bold },
  qrBox: {
    height: 36,
    width: 36,
    borderRadius: 8,
    backgroundColor: '#FF8C3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 40 },
  // Unified card container (no external gaps)
  card: {
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e6e6',
  },
  // Gradient header inside the card
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    
  },
  avatar: { width: 94, height: 94, borderRadius: 10, borderWidth: 0, borderColor: '#000', backgroundColor: '#eee', marginBottom: 8 },
  name: { fontSize: 18, fontFamily: Font.bold, color: '#000' },
  program: { marginTop: 2, fontSize: 13, color: '#111' },
  reg: { marginTop: 2, fontSize: 12, color: '#222' },

  sectionWrapper: { marginTop: 0 },
  sectionHeader: { backgroundColor: '#2d2c2d', paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center',marginTop: 16 },
  sectionTitle: { color: '#fff', fontFamily: Font.bold, fontSize: 14 },
  sectionBody: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  fieldRow: { paddingVertical: 10 },
  fieldLabel: { fontSize: 12, color: 'rgba(45,44,45,0.85)', fontFamily: Font.bold },
  fieldValue: { marginTop: 2, fontSize: 14, color: '#666' },
});
