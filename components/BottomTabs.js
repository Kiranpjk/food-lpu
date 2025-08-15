// components/BottomTabs.js
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomTabs({ activeTab = 'Dashboard' }) {
  const tabs = [
    { name: 'Dashboard', icon: 'grid-view' },
    { name: 'Happenings', icon: 'event' },
    { name: 'RMS', icon: 'description' },
    { name: 'Quick Quiz', icon: 'list' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity key={index} style={styles.tab}>
            <MaterialIcons 
              name={tab.icon} 
              size={24} 
              color={isActive ? '#d68e55' : '#8E8E93'} 
            />
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
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  activeLabel: {
    color: '#d68e55',
  },
})
