import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Font } from '../constants/Typography';
import CategoryItem from './CategoryItem';

const categoriesData = [
  { id: '1', icon: 'campaign', label: 'Announce', badgeCount: 10 },
  { id: '2', icon: 'checklist', label: 'Attendance' },
  { id: '3', icon: 'bar-chart', label: 'Results' },
  { id: '4', icon: 'menu-book', label: 'Library', badgeCount: 2 },
  { id: '5', icon: 'receipt', label: 'Mess Food Scanner' },
  { id: '6', icon: 'assignment', label: 'Assignments', badgeCount: 1 },
  { id: '7', icon: 'bar-chart', label: 'Results' },
  { id: '8', icon: 'menu-book', label: 'Library', badgeCount: 2 },
  { id: '9', icon: 'receipt', label: 'Events' }
];

export default function Categories() {
  const router = useRouter();

  const handlePress = (label: string) => {
    if (label === 'Mess Food Scanner') {
      router.push('/HostelMessScanner'); // Your scanner screen
    } else {
      console.log(`Clicked on: ${label}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Click on the plus button to add menu grids.
      </Text>

      {/* Grid */}
     <FlatList
  data={categoriesData}
  numColumns={3}
  renderItem={({ item }) => (
    <CategoryItem {...item} onPress={() => handlePress(item.label)} />
  )}
  keyExtractor={(item) => item.id}
  scrollEnabled={false}
  columnWrapperStyle={styles.row}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontFamily: Font.bold,
    color: '#333'
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Font.regular,
    color: '#888',
    marginTop: 4,
    marginBottom: 16
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 4
  }
});
