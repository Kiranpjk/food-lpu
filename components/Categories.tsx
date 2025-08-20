import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Font } from '../constants/Typography';
import CategoryItem from './CategoryItem';

const categoriesData = [
  { id: '1', icon: 'img:announce', label: 'Announce', badgeCount: 10 },
  { id: '2', icon: 'img:edu revolution', label: 'Edu Revolution' },
  { id: '3', icon: 'img:fee', label: 'Fee Statement' },
  { id: '4', icon: 'img:attendance', label: 'Attendance', badgeCount: '89 %' },
  { id: '5', icon: 'img:assignments', label: 'Assignments', badgeCount: 0 },
  { id: '6', icon: 'img:results', label: 'Results', badgeCount: 9.1 },
  { id: '7', icon: 'img:exam', label: 'Exams', badgeCount: 0 },
  { id: '8', icon: 'img:events', label: 'Events' },
  { id: '9', icon: 'img:mess', label: 'Mess Food Scanner'  ,badgeCount: 'X'},
  { id: '10', icon: 'img:mess', label: 'Hostel Leave Slip ', badgeCount: 'X' },
  { id: '11', icon: 'img:mess', label: 'Placement Drive', badgeCount: 'X' },
  { id: '12', icon: 'img:mess', label: 'Time table', badgeCount: 'X' },
];

export default function Categories() {
  const router = useRouter();

  const handlePress = (label: string) => {
    if (label === 'Mess Food Scanner') {
      router.push('/HostelMessScanner'); // Your scanner screen
    } else if (label === 'Edu-Revolution') {
      console.log(`Clicked on: ${label} - Opening education revolution features`);
    } else if (label === 'Fee Statement') {
      console.log(`Clicked on: ${label} - Opening fee statement`);
    } else if (label === 'Attendance') {
      console.log(`Clicked on: ${label} - Opening attendance tracker`);
    } else {
      console.log(`Clicked on: ${label}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Add More Tiles</Text>
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
    paddingVertical: 10,
    backgroundColor: '#fff' // Changed to white background
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontFamily: Font.bold,
    color: '#333',
    fontWeight:10
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
    color: '#333',
    marginTop: 4,
    marginBottom: 16
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 4
  }
});
