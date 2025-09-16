import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Font } from '../constants/Typography';

export default function TopBar({ onMenuPress, onNotificationPress, notificationCount }) {
  return (
    <>
      {/* This sets the status bar background and icon color */}
      <StatusBar
        translucent={false} // status bar is not transparent
        backgroundColor="#fff" // white background behind status bar icons
        barStyle="dark-content" // dark icons/text in status bar
      />

      <View style={styles.topBar}>

        {/* Menu Button */}
        <TouchableOpacity onPress={onMenuPress}>
          <Image 
            source={require('../assets/images/menu.png')} 
            style={styles.menuIcon} 
          />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.title}>Dashboard</Text>

        {/* Notification Icon with Badge (no-op on press) */}
        <TouchableOpacity style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={28} color="#000" />
          {notificationCount > 0 && (
            <LinearGradient 
              colors={["#e47668", "#e59769", "#ffdb79"]} 
              start={{x:0,y:0}} 
              end={{x:1,y:0}} 
              style={styles.badge}
            >
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    zIndex: 1000
  },
  title: {
    fontSize: 18,
    fontFamily: Font.bold
  },
  menuIcon: {
    width: 40,
    height: 40
  },
  notificationWrapper: {
    position: 'relative',
    color: '#fff'
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontFamily: Font.bold
  }
});
