// components/BottomTabs.js
import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomTabs({ activeTab = 'Dashboard' }) {
  const tabs = [
    { name: 'Dashboard', icon: 'grid-view', type: 'icon' },
    { name: 'Happenings', image: require('../assets/images/happening.png'), type: 'image' },
    { name: 'RMS', image: require('../assets/images/rms.png'), type: 'image' },
    { name: 'Quick Quiz', icon: 'list', type: 'icon' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity key={index} style={styles.tab}>
            {tab.type === 'icon' ? (
              <MaterialIcons 
                name={tab.icon} 
                size={24} 
                color={isActive ? '#d68e55' : '#8E8E93'} 
              />
            ) : (
              <Image
                source={tab.image}
                style={[styles.tabImage, { tintColor: isActive ? '#d68e55' : '#8E8E93' }]}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
  },
  tab: {
    alignItems: 'center',
  },
  tabImage: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  activeLabel: {
    color: '#d68e55',
  },
})
