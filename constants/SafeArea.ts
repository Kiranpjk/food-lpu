import { StyleSheet } from 'react-native';
import { Edge } from 'react-native-safe-area-context';

// Universal safe area styles
export const SafeAreaStyles = StyleSheet.create({
  universalSafeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light grey for universal safe area
  },
  transparentSafeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Main app background
  },
});

// Safe area configuration
export const UNIVERSAL_SAFE_AREA_CONFIG = {
  edges: ['top', 'bottom'] as readonly Edge[], // Only top and bottom for universal handling
  backgroundColor: '#000', // Light grey
};
