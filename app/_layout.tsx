import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [loaded] = useFonts({
    //SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nunito_400Regular,
    Nunito_700Bold,
  });

  // Show a popup when a notification is clicked (opens app)
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      try {
        console.log('[Notification Clicked]', JSON.stringify(response, null, 2));
      } catch {}
      Alert.alert('Notification clicked', 'Opened from a notification');
    });
    return () => {
      sub.remove();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        {/* Top safe area overlay */}
        {insets.top > 0 && (
          <View pointerEvents="none" style={[styles.topOverlay, { height: insets.top }]} />
        )}
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="HostelMessScanner" />
          <Stack.Screen name="MessCoupon" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="+not-found" />
        </Stack>
        
        {/* Bottom safe area overlay */}
        {insets.bottom > 0 && (
          <View pointerEvents="none" style={[styles.bottomOverlay, { height: insets.bottom }]} />
        )}
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2d2c2d',
    zIndex: 999,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2d2c2d',
    zIndex: 999,
  },
});