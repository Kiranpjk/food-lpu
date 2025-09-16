
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = Math.round(SCREEN_WIDTH * 0.65);

type SideMenuOption = {
  label: string;
  onPress: () => void;
};

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  options?: SideMenuOption[];
}

export default function SideMenu({ visible, onClose, options = [] }: SideMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Simple slide-in animation when opening
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [render, setRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setRender(true);
      // reset to hidden position then animate in
      translateX.setValue(-MENU_WIDTH);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true })
      ]).start();
    } else if (render) {
      // animate out then unmount
      Animated.parallel([
        Animated.timing(translateX, { toValue: -MENU_WIDTH, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true })
      ]).start(({ finished }) => {
        if (finished) setRender(false);
      });
    }
  }, [visible]);

  const [query, setQuery] = useState('');

  const defaultCategories: SideMenuOption[] = useMemo(() => ([
    { label: '10 to Thrive', onPress: onClose },
    { label: 'Alumni Mentor Selection', onPress: onClose },
    { label: 'Assignment (CA)', onPress: onClose },
    { label: 'Back to Basics', onPress: onClose },
    { label: 'Backlog Registration', onPress: onClose },
    { label: 'Book Appointment', onPress: onClose },
    { label: 'Change UMS Password', onPress: onClose },
    { label: 'Continue Exit Undertaking', onPress: onClose },
    { label: 'Doctor Appointment', onPress: onClose },
    { label: 'Document Upload', onPress: onClose },
    { label: 'Electives Polling', onPress: onClose },
    { label: 'Entry Exit Logs', onPress: onClose },
    { label: 'Evaluation of Teaching Internship', onPress: onClose },
    { label: 'Event Attendance', onPress: onClose },
    { label: 'Event Attendance QR Scanner', onPress: onClose },
    { label: 'Exam Attendance', onPress: onClose },
    { label: 'Fee Payment', onPress: onClose },
    { label: 'Fee Payment Schedule', onPress: onClose },
    { label: 'Fee Statement', onPress: onClose },
    { label: 'Feedback on Mentor Meeting', onPress: onClose },
    { label: 'Food Shops', onPress: onClose },
    { label: 'Guest Lecture/Workshop Feedback', onPress: onClose },
    { label: 'Hostel Leave Slip', onPress: onClose },
    { label: 'Inventory', onPress: onClose },
    { label: 'Lab Resource Feedback', onPress: onClose },
    { label: 'Language Lab Slot Booking', onPress: onClose },
    { label: 'Laundry', onPress: onClose },
    { label: 'Lecture Feedback', onPress: onClose },
    { label: 'Library Resource Feedback', onPress: onClose },
    { label: 'Library Search', onPress: onClose },
    { label: 'List of Holidays', onPress: onClose },
    { label: 'Make Up Adjustment', onPress: onClose },
    { label: 'Mentor Meeting Details', onPress: onClose },
    { label: 'Mess Food Feedback', onPress: onClose },
    { label: 'Mess Food Scanner', onPress: onClose },
    { label: 'Open Minor Area Preference', onPress: onClose },
    // Additional items
    { label: 'RMS Scanner', onPress: onClose },
    { label: 'Skill Development Feedback', onPress: onClose },
    { label: 'Special Food Services', onPress: onClose },
    { label: 'Student Class Feedback', onPress: onClose },
    { label: 'Student Feedback', onPress: onClose },
    { label: 'Teacher on Leave', onPress: onClose },
    { label: 'Time table', onPress: onClose },
    { label: 'Transport Preference', onPress: onClose },
    { label: 'Uni Hospital Help Line', onPress: onClose },
    { label: 'Vendor Facility Search', onPress: onClose },
    { label: 'View Marks', onPress: onClose },
    { label: 'Virtual Tour', onPress: onClose },
    { label: 'Visitor Gate Pass', onPress: onClose },
  ]), [onClose]);

  if (!render) return null;
  return (
    <View style={styles.overlay}>
      {/* Menu first so it appears on the LEFT side */}
  <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
        {/* Profile Header */}
        <LinearGradient
          colors={["#e47668", "#e59769", "#ffdb79"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.header, styles.gradientShadow, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={() => { onClose(); router.push('/profile'); }}>
            <Image source={require('../assets/images/photo.jpg')} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.profileTextWrap}>
            <Text style={styles.name}>Pybogula Jaya Kiran</Text>
            <Text style={styles.reg}>12305441</Text>
            <Text style={styles.course}>P132-L-B.Tech [Computer Science and Engineering]       [Lateral Entry](2023)</Text>
          </View>
        </LinearGradient>

        {/* Content Area: Search + Items */}
        <View style={styles.contentArea}>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {defaultCategories
              .filter(opt => opt.label.toLowerCase().includes(query.trim().toLowerCase()))
              .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
              .map((opt, i) => {
                // Choose a suitable Ionicon per item
                const label = opt.label.toLowerCase();
                let icon: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
                if (label.includes('qr') || label.includes('scanner')) icon = 'qr-code-outline';
                else if (label.includes('assignment') || label.includes('statement') || label.includes('document')) icon = 'document-text-outline';
                else if (label.includes('appointment') || label.includes('schedule') || label.includes('time table') || label.includes('time')) icon = 'calendar-outline';
                else if (label.includes('password')) icon = 'key-outline';
                else if (label.includes('doctor') || label.includes('hospital')) icon = 'medkit-outline';
                else if (label.includes('upload')) icon = 'cloud-upload-outline';
                else if (label.includes('entry') || label.includes('exit') || label.includes('leave')) icon = 'log-out-outline';
                else if (label.includes('evaluation') || label.includes('exam') || label.includes('marks')) icon = 'school-outline';
                else if (label.includes('event')) icon = 'sparkles-outline';
                else if (label.includes('fee')) icon = 'card-outline';
                else if (label.includes('feedback')) icon = 'chatbubble-ellipses-outline';
                else if (label.includes('food') || label.includes('special')) icon = 'fast-food-outline';
                else if (label.includes('hostel')) icon = 'home-outline';
                else if (label.includes('inventory') || label.includes('vendor') || label.includes('facility')) icon = 'cube-outline';
                else if (label.includes('lab')) icon = 'beaker-outline';
                else if (label.includes('laundry') || label.includes('water')) icon = 'water-outline';
                else if (label.includes('lecture') || label.includes('alumni') || label.includes('mentor') || label.includes('skill')) icon = 'people-outline';
                else if (label.includes('library')) icon = 'book-outline';
                else if (label.includes('search')) icon = 'search-outline';
                else if (label.includes('holiday')) icon = 'calendar-clear-outline';
                else if (label.includes('transport')) icon = 'bus-outline';
                else if (label.includes('rms')) icon = 'scan-outline';
                else if (label.includes('virtual') || label.includes('uni')) icon = 'globe-outline';
                else if (label.includes('view')) icon = 'trophy-outline';
                else if (label.includes('preference') || label.includes('poll')) icon = 'options-outline';
                else if (label.includes('teacher')) icon = 'person-remove-outline';
                else if (label.includes('thrive') || label.includes('basics')) icon = 'ribbon-outline';
                return (
                  <TouchableOpacity key={i} style={styles.itemRow} onPress={opt.onPress}>
                    <Ionicons name={icon} size={18} color="#222" style={{ marginRight: 10 }} />
                    <Text style={styles.itemText}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>

        {/* Logout Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 6) }]}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.9}>
            <LinearGradient
              colors={["#e47668", "#e59769", "#ffdb79"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.logoutBtn, styles.gradientShadow]}
            >
              <Ionicons name="log-out-outline" size={18} color="#000" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* Backdrop fills the remaining RIGHT area */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    flexDirection: 'row',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  menu: {
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    height: '100%',
   
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom:10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    //marginTop:100,
  
  },
  gradientShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#ddd',
    marginTop: 5,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  profileTextWrap: { alignItems: 'center' },
  name: { fontSize: 16, color: '#000', fontWeight: '700', textAlign: 'center' },
  reg: { fontSize: 12, color: '#000', opacity: 0.9, marginTop: 2, textAlign: 'center' },
  course: { fontSize: 12, color: '#000', opacity: 0.9, marginTop: 0, textAlign: 'center',marginBottom:25 },
  contentArea: { flex: 1, backgroundColor: '#fff',marginTop:-5 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: { marginLeft: 8, flex: 1, color: '#000', paddingVertical: 0 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 16, color: '#222' },
  // Footer for Logout button
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 4,
  },
  logoutBtn: {
    height: 44,
   //marginBottom: -5,
     marginTop:-4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoutText: { fontSize: 16, color: '#000', fontWeight: '700', marginLeft: 8 },
});
