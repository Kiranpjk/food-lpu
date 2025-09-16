
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import BottomTabs from '../../components/BottomTabs';
import Categories from '../../components/Categories';
import SideMenu from '../../components/SideMenu';
import { TodaysSchedule } from '../../components/TodaysSchedule';
import TopBar from '../../components/TopBar';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOptions = [
    { label: 'Home', onPress: () => setMenuOpen(false) },
    { label: 'Profile', onPress: () => setMenuOpen(false) },
    { label: 'Meal History', onPress: () => setMenuOpen(false) },
    { label: 'Settings', onPress: () => setMenuOpen(false) },
    { label: 'Logout', onPress: () => setMenuOpen(false) },
  ];
  return (
    <View style={styles.container}>
      {/* Top navigation bar */}
      <TopBar
        onMenuPress={() => setMenuOpen(true)}
        onNotificationPress={() => Alert.alert('Notifications clicked')}
        notificationCount={5}
      />

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.content}>
        <TodaysSchedule />
        <Categories />
      </ScrollView>
      <BottomTabs/>
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} options={menuOptions} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    paddingBottom: 20
  }
}
);
