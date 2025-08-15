import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';

// Import your photo
const myPhoto = require('../assets/images/photo.jpg');

// Static demo data – replace with real user profile data when available
const PROFILE = {
  name: 'Pybogula Jaya Kiran',
  father: 'Pybogula Somanna  (+91 9876543210)',
  mother: 'Pybogula Lakshmi  (+91 9123456780)',
  program: 'B.Tech CSE (AI & ML)  5th Sem  (ID: 12345678)',
  hostel: 'Boys Hostel-03-A614-Bed C (Std Non-AC-4-Seater)',
//  warning: 'Your hostel confirmation and mess allocation is still pending. Please contact the warden desk to avoid disruption in meals.'
};

export default function MessCouponScreen() {
  const router = useRouter();
  const { meal, status } = useLocalSearchParams();
  const showSuccess = status === 'success' && meal;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>      
      {/* Custom Header */}
      <View style={styles.header}>        
  <TouchableOpacity style={styles.headerIcon} onPress={() => router.replace('/(tabs)')} accessibilityRole="button" accessibilityLabel="Go home">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mess Coupon</Text>
        <TouchableOpacity onPress={() => router.push('/HostelMessScanner')} accessibilityRole="button" accessibilityLabel="Meal history">
          <Text style={styles.historyLink}>Meal History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollViewBackground}>
        <View style={styles.cardWrapper}>
          {/* Upper Gradient Section */}
          <LinearGradient colors={["#e47668", "#e59769", "#ffdb79"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.gradientCard}>
            <View style={styles.avatarWrapper}>  
              <Image
                source={myPhoto}
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

          {/* Extension Section (attached) */}
          <View style={styles.extensionSection}>
            <Text style={styles.ctaText}>Tap on the meal name to scan and avail food.</Text>
            <View style={styles.mealsGroup}>
              <View style={styles.mealRowTwo}> 
                <MealBox label="Breakfast" />
                
                <MealBox label="Lunch" />
              </View>
              <View style={styles.mealRowSingle}>
                <View style={styles.dinnerContainer}>
                  <MealBox label="Dinner" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {showSuccess && (
        <View style={styles.successOverlay} accessibilityRole="dialog" accessibilityLabel="Scan success dialog">
          <View style={styles.successCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.replace('/HostelMessScanner')}
              accessibilityRole="button"
              accessibilityLabel="Close success dialog"
            >
              <Ionicons name="close" size={22} color="#222" />
            </TouchableOpacity>
            <Ionicons name="checkmark-circle" size={70} color="#2E7D32" style={styles.successIcon} />
            <Text style={styles.successTitle}>Coupon Accepted</Text>
            <Text style={styles.successMeal}>{String(meal).toUpperCase()} SCANNED</Text>
            <View style={styles.successDivider} />
            <View style={styles.successDetails}>
              <Text style={styles.detailLine}>{PROFILE.name}</Text>
              <Text style={styles.detailLine}>{PROFILE.program}</Text>
              <Text style={styles.detailLine}>{PROFILE.hostel}</Text>
              <Text style={styles.detailLineSmall}>Timestamp: {new Date().toLocaleTimeString()}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.replace('/HostelMessScanner')}
              style={styles.dismissBtn}
              accessibilityRole="button"
              accessibilityLabel="Dismiss dialog"
            >
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>      
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MealBox({ label }) {
  const router = useRouter();
  const handlePress = () => {
    const slug = label.toLowerCase();
    router.push(`/scan/${slug}`);
  };
  
  return (
    <TouchableOpacity style={styles.mealBox} onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Open ${label} scanner`}>
      {/* <LinearGradient colors={["#FF8A00", "#FFC300"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mealGradient}> */}
         <LinearGradient colors={["#e47668", "#e59769", "#ffdb79"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mealGradient}>
        <View style={styles.mealContent}> 
          <Text style={styles.mealText}>{label}</Text>
          <Ionicons name="arrow-forward" size={22} color="#000" style={styles.mealIconRight} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    height: 60,
    backgroundColor: '#2d2c2d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6
  },
  headerIcon: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: '#fff'
  },
  historyLink: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: '#fff'
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 8
  },
  scrollViewBackground: {
    backgroundColor: '#fff'
  },
  cardWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 18
  },
  gradientCard: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 24,
    position: 'relative'
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius:8,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#FF8C3A'
  },
  name: {
    fontSize: 20,
    fontFamily: Font.bold,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 16
  },
  infoList: {
    gap: 14,
    marginBottom: 18,
    fontFamily:Font.bold
  },
  infoItem: {},
  infoLabel: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: '#000000',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Font.regular,
    color: '#00000000000',
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
  },
  extensionSection: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)'
  },
  mealsGroup: {
    marginTop: 18,
    gap: 14
  },
  mealRowTwo: {
    flexDirection: 'row',
    gap: 14
  },
  mealRowSingle: {
    flexDirection: 'row',
    marginTop: 0
  },
  dinnerContainer: {
    flex: 0.48,
  },
  mealBox: {
    flex: 1,
    height: 60,
    borderRadius: 9,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 15
  },
  mealGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mealContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  mealIconRight: { marginLeft: 12 },
  mealText: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: '#000'
  },
  // Success overlay styles
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  successCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    backgroundColor: '#fff',
    paddingTop: 46,
    paddingHorizontal: 30,
    paddingBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  successIcon: { marginBottom: 10 },
  successTitle: { fontSize: 22, fontFamily: Font.bold, color: '#1b5e20' },
  successMeal: { marginTop: 4, fontSize: 14, fontFamily: Font.bold, color: '#2e7d32', letterSpacing: 0.5 },
  successDivider: { height: 1, backgroundColor: '#e1e1e1', width: '100%', marginVertical: 18 },
  successDetails: { width: '100%', gap: 6, marginBottom: 4 },
  detailLine: { fontSize: 13, fontFamily: Font.bold, color: '#333' },
  detailLineSmall: { fontSize: 11, color: '#555', marginTop: 4 },
  dismissBtn: { marginTop: 18, backgroundColor: '#2E7D32', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 26 },
  dismissText: { color: '#fff', fontSize: 15, fontFamily: Font.bold, letterSpacing: 0.5 }
});
