import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Font } from '../../constants/Typography';

export default function MealScanScreen() {
  const { meal } = useLocalSearchParams<{ meal: string }>();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Dynamic square viewfinder size (72% of width capped with margin)
  // Reduced square size per request (from 72% -> 60%)
  const squareSize = Math.min(width * 0.60, width - 80);
  const leftX = (width - squareSize) / 2;
  const topY = (height - squareSize) / 2; // center vertically

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission().catch((e: any) => setError(e.message));
    }
    
    // Configure audio session for beep sound
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Could not configure audio:', error);
      }
    };
    
    configureAudio();
  }, [permission, requestPermission]);

  // Function to play beep sound
  const playBeepSound = async () => {
    try {
      console.log('Attempting to play beep sound...');
      
      // Create a simple beep sound programmatically
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMapDhLNWhQZGF0YWoAAAD//wA='
        },
        { 
          shouldPlay: false,
          volume: 1.0,
          rate: 1.0
        }
      );
      
      // Play the sound
      console.log('Playing beep sound...');
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
      
      // Unload sound from memory after playing
      setTimeout(() => {
        sound.unloadAsync();
        console.log('Beep sound completed');
      }, 500);
    } catch (error) {
      console.log('Could not play beep sound:', error);
    }
  };

  const onBarcodeScanned = useCallback(async (result: any) => {
    if (scanned) return;
    setScanned(true);
    
    // Play beep sound when QR code is scanned
    await playBeepSound();
    
    try {
  const data = result.data ?? result?.rawValue ?? JSON.stringify(result);
  // Navigate to result screen (denied example). Change status when backend validates.
  // Repeat detection within 1 minute (any QR)
  const now = Date.now();
  const repeat = (globalThis as any).__lastScanAt && (now - (globalThis as any).__lastScanAt < 60_000);
  (globalThis as any).__lastScanAt = now;
  router.replace({ pathname: '/scan-success', params: { meal, token: encodeURIComponent(data), repeat: repeat ? '1' : '0' } } as any);
    } catch (e: any) {
      setError(e.message || 'Scan failed');
      setScanned(false);
    }
  }, [scanned, router]);

  if (!permission) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.status}>Requesting camera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera" size={42} color="#666" />
        <Text style={styles.status}>Camera access needed to scan {meal} coupon.</Text>
        <Text style={styles.statusSmall}>Please enable camera permission in system settings.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top','bottom']}>
      <View style={styles.container}>
        <View style={[styles.cameraShell,{marginTop:0, marginBottom:0}]}> 
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={onBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        </View>
        {/* Overlay mask with transparent square */}
        <View style={styles.overlay} pointerEvents="none">
          {/* Dark regions */}
          <View style={[styles.shade, { top: 0, left: 0, right: 0, height: topY }]} />
          <View style={[styles.shade, { top: topY, left: 0, width: leftX, height: squareSize }]} />
          <View style={[styles.shade, { top: topY, right: 0, width: leftX, height: squareSize }]} />
          <View style={[styles.shade, { top: topY + squareSize, left: 0, right: 0, bottom: 0 }]} />
          {/* Red scan line */}
          <View style={[styles.scanLine, { left: leftX + 6, width: squareSize - 12, top: topY + squareSize / 2 - 1 }]} />
          {/* Instruction text */}
          <Text style={[styles.instruction, { bottom: Math.max(insets.bottom, 12) + 8 }]}>
            {scanned ? 'Processing…' : 'Place a barcode inside the viewfinder rectangle to scan it.'}
          </Text>
          {error && <Text style={[styles.error, { bottom: Math.max(insets.bottom, 12) + 40 }]}>{error}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f0f0' }, // Universal grey safe area
  container: { flex: 1, backgroundColor: '#000', position: 'relative' },
  cameraShell: { flex: 1, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#000' },
  status: { color: '#fff', marginTop: 12, textAlign: 'center' },
  statusSmall: { color: '#ccc', marginTop: 4, fontSize: 12, textAlign: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  shade: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.55)' },
  scanLine: { position: 'absolute', height: 2, backgroundColor: 'rgba(255,45,45,0.55)', borderRadius: 2 },
  instruction: { position: 'absolute', left: 20, right: 20, textAlign: 'center', color: '#fff', fontSize: 13, fontFamily: Font.bold },
  error: { position: 'absolute', left: 20, right: 20, textAlign: 'center', color: '#FF5252', fontSize: 12 }
});
