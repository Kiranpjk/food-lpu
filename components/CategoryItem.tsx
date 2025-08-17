import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { AccessibilityRole, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Font } from '../constants/Typography';

// Import custom images
const customImages = {
  announce: require('../assets/images/announce.png'),
  'edu revolution': require('../assets/images/edu revolution.png'),
  fee: require('../assets/images/fee.png'),
  mess: require('../assets/images/mess.png'),
  attendance: require('../assets/images/attendance.png'),
  // Add more custom images here as needed
};

interface CategoryItemProps {
  /** Icon name. Prefix with `ion:` to use Ionicons, `img:` to use custom image, otherwise MaterialIcons is used. */
  icon: string;
  label: string;
  /** Optional numeric badge (e.g. unread count). Hidden when 0 or undefined. */
  badgeCount?: number;
  /** Optional press handler */
  onPress?: () => void;
  /** Override icon color */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

export default function CategoryItem({ icon, label, badgeCount, onPress, color = '#333', accessibilityLabel }: CategoryItemProps) {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;

  const renderIcon = () => {
    if (icon.startsWith('ion:')) {
      return <Ionicons name={icon.slice(4) as any} size={40} color={color} />;
    }
    if (icon.startsWith('img:')) {
      const imageName = icon.slice(4) as keyof typeof customImages;
      const imageSource = customImages[imageName];
      if (imageSource) {
        return <Image 
          source={imageSource} 
          style={styles.customIcon} 
        />;
      }
      // Fallback to MaterialIcons if image not found
      console.warn(`Custom image "${imageName}" not found`);
    }
    return <MaterialIcons name={icon as any} size={40} color={color} />;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={('button' as AccessibilityRole)}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={onPress ? `Activate to open ${label}` : undefined}
    >
      <View style={styles.iconWrapper}>
        {renderIcon()}
      </View>
      {showBadge && (
        <LinearGradient 
          colors={["#e47668", "#e59769", "#ffdb79"]} 
          start={{x:0,y:0}} 
          end={{x:1,y:0}} 
          style={styles.badge}
        >
          <Text style={styles.badgeText} numberOfLines={1} adjustsFontSizeToFit>
            {badgeCount}
          </Text>
        </LinearGradient>
      )}
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1, // Makes it a square
    backgroundColor: 'rgba(250, 249, 235, 1)',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e4dfd6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    minWidth: 0,
    minHeight: 130,
    position: 'relative',
    // Shadow properties
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customIcon: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: '#ffce91',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28
  },
  label: {
    fontSize: 12,
    fontFamily: Font.bold,
    color: '#333',
    textAlign: 'center'
  },
  badge: {
  position: 'absolute',
  top: -8, // move outside the top edge
  right: -8, // move outside the right edge
  borderRadius: 9,
  paddingHorizontal: 5,
  paddingVertical: 1,
  minWidth: 20,
  minHeight: 25,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 2,
  zIndex: 10
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontFamily: Font.bold
  }
});
