import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from '../../components/BottomTabs';
import Categories from '../../components/Categories'; // <-- import Categories here
import { TodaysSchedule } from '../../components/TodaysSchedule';
import TopBar from '../../components/TopBar';
import { SafeAreaStyles, UNIVERSAL_SAFE_AREA_CONFIG } from '../../constants/SafeArea';

export default function HomePage() {
  return (
    <SafeAreaView style={SafeAreaStyles.universalSafeArea} edges={UNIVERSAL_SAFE_AREA_CONFIG.edges}>
      <View style={SafeAreaStyles.container}>
        {/* Top navigation bar */}
        <TopBar
          onMenuPress={() => Alert.alert('Menu clicked')}
          onNotificationPress={() => Alert.alert('Notifications clicked')}
          notificationCount={5}
        />

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.content}>
          <TodaysSchedule />
          <Categories /> {/* <-- use Categories here */}
        </ScrollView>
        <BottomTabs/>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  content: {
    paddingBottom: 20
  }
});
