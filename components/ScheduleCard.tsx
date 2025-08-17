import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Font } from "../constants/Typography";

interface ScheduleCardProps {
  courseCode: string;
  details: string;
  statusText: string;
  statusColor: string;
  time: string;
  gradientColors: [string, string, string];
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  courseCode,
  details,
  statusText,
  statusColor,
  time,
  gradientColors,
}) => {
  return (
    <LinearGradient
      colors={gradientColors as any}
      start={{x:0,y:0}}
      end={{x:1,y:0}}
      style={styles.card}
    >
      {/* Background graphic */}
      {/* <Image
        source={require("../assets/books.png")} // You'll need to add a subtle book graphic here
        style={styles.bgImage}
        resizeMode="contain"
      /> */}

      {/* Top Content */}
      <View style={styles.content}>
        <Text style={styles.courseCode}>{courseCode}</Text>
        <Text style={styles.details}>{details}</Text>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        
        {/* Book Icon Background */}
        <MaterialIcons 
          name="menu-book" 
          size={60} 
          color="rgba(0,0,0,0.1)" 
          style={styles.bookIcon}
        />
      </View>

      {/* Time Banner */}
      <View style={styles.timeBanner}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
    minHeight: 120,
  },
  bgImage: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 80,
    height: 80,
    opacity: 0.2,
  },
  content: {
    padding: 16,
    flex: 1,
    position: "relative",
  },
  bookIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 0,
  },
  courseCode: {
    color: "#000",
    fontSize: 20,
    fontFamily: Font.bold,
  },
  details: {
    color: "#000",
    fontSize: 12,
    fontFamily: Font.regular,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: Font.regular,
  },
  timeBanner: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 8,
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: Font.bold,
  },
});
