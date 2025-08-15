import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import BottomTabs from '../../components/BottomTabs';
import Categories from '../../components/Categories'; // <-- import Categories here
import { TodaysSchedule } from '../../components/TodaysSchedule';
import TopBar from '../../components/TopBar';




export default function HomePage() {
  return (
    <View style={styles.container}>
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
