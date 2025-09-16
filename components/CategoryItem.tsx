import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AccessibilityRole, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Font } from '../constants/Typography';

// Import custom images
const customImages = {
  announce: require('../assets/images/announce.png'),
  'edu revolution': require('../assets/images/edu revolution.png'),
  fee: require('../assets/images/fee.png'),
  mess: require('../assets/images/mess.png'),
  attendance: require('../assets/images/attendance.png'),
  assignments: require('../assets/images/assignments.png'),
  results: require('../assets/images/results.png'),
  exam: require('../assets/images/exam.png'),
  events: require('../assets/images/events.png'),
  // Add more custom images here as needed
};

interface CategoryItemProps {
  /** Icon name. Prefix with `ion:` to use Ionicons, `img:` to use custom image, otherwise MaterialIcons is used. */
  icon: string;
  label: string;
  /** Optional badge (number or string, e.g. unread count or percentage). Hidden when undefined or empty string. */
  badgeCount?: number | string;
  /** Optional press handler */
  onPress?: () => void;
  /** Override icon color */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

export default function CategoryItem({ icon, label, badgeCount, onPress, color = '#333', accessibilityLabel }: CategoryItemProps) {
  const showBadge = badgeCount !== undefined && badgeCount !== '';
  // Normalize label to catch variants like 'Edu Revolution' vs 'Edu-Revolution'
  const normalized = label.trim().toLowerCase().replace(/[-_\s]+/g, ' ');
  const isEduRevolution = normalized === 'edu revolution';

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
      style={[styles.container, isEduRevolution && styles.eduContainerBorder]}
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
      <View style={[styles.labelContainer, isEduRevolution && styles.eduLabelBorder]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eduContainerBorder: {
    borderWidth: 2,
    borderColor: 'rgba(228, 118, 104, 0.8)  ',
  },
  eduLabelBorder: {
    borderWidth: 1.5,
    borderColor: 'rgba(228, 118, 104, 0.5)',
  },
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
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
      labelContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: '#ffc890', // Increased opacity
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 23
      },
    
  label: {
    fontSize: 12,
    fontFamily: Font.regular,
    color: '#333',
    textAlign: 'center'
  },
  badge: {
  position: 'absolute',
  top: -8, // move outside the top edge
  right: -8, // move outside the right edge
  borderRadius: 5,
  paddingHorizontal: 8,
  paddingVertical: 3,
  minWidth: 20,
  minHeight: 20,
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
    fontFamily: Font.regular
  }
});
