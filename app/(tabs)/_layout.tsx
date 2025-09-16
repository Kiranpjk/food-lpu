import { Slot } from 'expo-router';

// Tabs layout should only render a Slot so the index screen becomes the first screen.
export default function TabsLayout() {
  return <Slot />;
}
